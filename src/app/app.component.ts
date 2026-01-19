import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
    
    <!-- Animated background elements -->
    <div class="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <!-- Large gradient orbs -->
      <div class="absolute top-1/4 -left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-mood-calm/5 via-mood-happy/5 to-transparent blur-3xl animate-pulse-slow"></div>
      <div class="absolute bottom-1/4 -right-1/4 w-96 h-96 rounded-full bg-gradient-to-l from-mood-energetic/5 via-mood-sad/5 to-transparent blur-3xl animate-pulse-slow" style="animation-delay: 1.5s;"></div>
      
      <!-- Floating particles -->
      <div class="absolute top-1/3 left-1/4 w-4 h-4 rounded-full bg-mood-calm/20 animate-float"></div>
      <div class="absolute top-1/2 right-1/3 w-6 h-6 rounded-full bg-mood-happy/20 animate-float" style="animation-delay: 1s; animation-duration: 7s;"></div>
      <div class="absolute bottom-1/3 left-1/3 w-8 h-8 rounded-full bg-mood-energetic/20 animate-float" style="animation-delay: 2s; animation-duration: 8s;"></div>
      
      <!-- Grid pattern overlay -->
      <div class="absolute inset-0 opacity-5" 
           style="background-image: linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px); background-size: 50px 50px;">
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent {}