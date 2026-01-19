import { Component, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MoodService } from '../../services/mood.service';
import { IconComponent } from '../ui/icon.component';

interface Mood {
  name: string;
  color: string;
  icon: string;
  description: string;
}

interface Track {
  title: string;
  artist: string;
  energy: number;
  valence: number;
  duration: string;
  icon: string;
}

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('moodCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  moods: Mood[] = [
    { 
      name: 'calm', 
      color: '#6366f1', 
      icon: 'cloud',
      description: 'Peaceful, relaxed state'
    },
    { 
      name: 'happy', 
      color: '#10b981', 
      icon: 'happy',
      description: 'Joyful, positive energy'
    },
    { 
      name: 'energetic', 
      color: '#f59e0b', 
      icon: 'bolt',
      description: 'High energy, motivated'
    },
    { 
      name: 'melancholic', 
      color: '#8b5cf6', 
      icon: 'sad',
      description: 'Reflective, deep emotion'
    },
    { 
      name: 'intense', 
      color: '#ef4444', 
      icon: 'sparkles',
      description: 'Strong, passionate feelings'
    },
    { 
      name: 'neutral', 
      color: '#94a3b8', 
      icon: 'sun',
      description: 'Balanced, centered state'
    }
  ];
  
  selectedMood = this.moods[0];
  moodPoints: Array<{x: number, y: number, color: string}> = [];
  isBrowser: boolean;
  
  suggestedTracks: Track[] = [
    { 
      title: 'Ambient Dreams', 
      artist: 'Luna Fields', 
      energy: 85, 
      valence: 75,
      duration: '3:45',
      icon: 'music'
    },
    { 
      title: 'Synthwave Drive', 
      artist: 'Neon Future', 
      energy: 92, 
      valence: 68,
      duration: '4:20',
      icon: 'bolt'
    },
    { 
      title: 'Morning Fog', 
      artist: 'Piano Echoes', 
      energy: 42, 
      valence: 88,
      duration: '5:10',
      icon: 'cloud'
    }
  ];

  constructor(
    public moodService: MoodService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.drawGrid();
    }
  }

  onCanvasClick(event: MouseEvent): void {
    if (!this.isBrowser) return;
    
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    
    const x = ((event.clientX - rect.left) / canvas.width) * 100;
    const y = ((event.clientY - rect.top) / canvas.height) * 100;
    
    this.moodPoints.push({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      color: this.selectedMood.color
    });
    
    this.drawMoodPoint(event.clientX - rect.left, event.clientY - rect.top);
    
    this.moodService.setMood(x, 100 - y, this.selectedMood.color);
  }

  private drawGrid(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let i = 0; i <= 100; i += 10) {
      const x = (i / 100) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 0; i <= 100; i += 10) {
      const y = (i / 100) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw existing points
    this.moodPoints.forEach(point => {
      this.drawMoodPoint(point.x, point.y, point.color);
    });
  }

  private drawMoodPoint(x: number, y: number, color = this.selectedMood.color): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    
    // Draw glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
    gradient.addColorStop(0, `${color}80`);
    gradient.addColorStop(1, `${color}00`);
    
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw point
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  clearCanvas(): void {
    this.moodPoints = [];
    if (this.isBrowser) {
      this.drawGrid();
    }
  }

  onMoodSelect(mood: Mood): void {
    this.selectedMood = mood;
  }

  // Helper method for template
  getMoodPointsPercentage(): number {
    return Math.min(this.moodPoints.length * 10, 100);
  }
}