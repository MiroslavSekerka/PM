import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonIcon, IonText } from '@ionic/angular/standalone';
import { GameService, GameState } from '../services/game.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonText, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonIcon, CommonModule]
})
export class Tab1Page implements OnInit, OnDestroy {
  gameState: GameState = {
    energy: 0,
    totalEnergy: 0,
    totalClicks: 0,
    energyPerClick: 1,
    energyPerSecond: 0,
    upgrades: []
  };
  private subscription!: Subscription;
  clickAnimation = false;
  showEnergyPopup = false;
  energyGained = 0;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.subscription = this.gameService.state$.subscribe(state => {
      this.gameState = state;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onPlanetClick(event: MouseEvent) {
    this.gameService.click();
    this.clickAnimation = true;
    
    this.energyGained = this.gameState.energyPerClick;
    this.showEnergyPopup = true;
    
    setTimeout(() => {
      this.clickAnimation = false;
      this.showEnergyPopup = false;
    }, 300);
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return Math.floor(num).toString();
  }
}