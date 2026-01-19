import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Howl } from 'howler';

export interface Mood {
  energy: number;
  valence: number;
  timestamp: Date;
  color: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  mood: Partial<Mood>;
}

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private moodHistory: Mood[] = [];
  private currentMood: Mood = {
    energy: 50,
    valence: 50,
    timestamp: new Date(),
    color: '#94a3b8'
  };
  
  private player: Howl | null = null;
  private isBrowser: boolean;
  
  private tracks: Track[] = [
    { id: '1', title: 'Calm Waves', artist: 'Nature Sounds', mood: { energy: 20, valence: 80 } },
    { id: '2', title: 'Energetic Flow', artist: 'Synthwave', mood: { energy: 90, valence: 70 } },
    { id: '3', title: 'Melancholic Rain', artist: 'Piano Dreams', mood: { energy: 30, valence: 30 } },
    { id: '4', title: 'Happy Breeze', artist: 'Indie Folk', mood: { energy: 60, valence: 90 } },
    { id: '5', title: 'Dark Ambience', artist: 'Drone Zone', mood: { energy: 40, valence: 20 } },
  ];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadMoodHistory();
  }

  setMood(energy: number, valence: number, color: string): void {
    this.currentMood = { energy, valence, timestamp: new Date(), color };
    this.moodHistory.push({ ...this.currentMood });
    this.saveMoodHistory();
    this.findMatchingTrack();
  }

  private findMatchingTrack(): void {
    const tracksWithScore = this.tracks.map(track => ({
      track,
      score: this.calculateMatchScore(track.mood)
    }));
    
    const bestMatch = tracksWithScore.sort((a, b) => b.score - a.score)[0];
    
    console.log('Best match:', bestMatch.track.title, 'Score:', bestMatch.score);
    this.playPreview(bestMatch.track.id);
  }

  private calculateMatchScore(trackMood: Partial<Mood>): number {
    const energyDiff = Math.abs((trackMood.energy || 50) - this.currentMood.energy);
    const valenceDiff = Math.abs((trackMood.valence || 50) - this.currentMood.valence);
    
    return 100 - (energyDiff + valenceDiff) / 2;
  }

  private playPreview(trackId: string): void {
    if (!this.isBrowser) return;
    
    if (this.player) {
      this.player.stop();
    }
    
    console.log('Playing track:', trackId);
    
    this.player = new Howl({
      src: ['assets/sounds/preview.mp3'],
      volume: 0.5,
      onend: () => console.log('Finished playing')
    });
  }

  getCurrentMood(): Mood {
    return { ...this.currentMood };
  }

  getMoodHistory(): Mood[] {
    return [...this.moodHistory];
  }

  getSuggestedTracks(): Track[] {
    return this.tracks
      .map(track => ({
        track,
        score: this.calculateMatchScore(track.mood)
      }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.track)
      .slice(0, 3);
  }

  private saveMoodHistory(): void {
    if (!this.isBrowser) return;
    localStorage.setItem('moodHistory', JSON.stringify(this.moodHistory));
  }

  private loadMoodHistory(): void {
    if (!this.isBrowser) return;
    
    try {
      const saved = localStorage.getItem('moodHistory');
      if (saved) {
        this.moodHistory = JSON.parse(saved);
        if (this.moodHistory.length > 0) {
          this.currentMood = this.moodHistory[this.moodHistory.length - 1];
        }
      }
    } catch (e) {
      console.warn('Failed to load mood history:', e);
    }
  }
}