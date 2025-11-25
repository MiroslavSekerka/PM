import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService, GameState } from '../services/game.service';
import { Subscription } from 'rxjs';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonIcon, IonCardContent, IonList, IonItem, IonLabel, IonButton, IonText } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonText, IonButton, IonLabel, IonItem, IonList, IonCardContent, IonIcon, IonCardTitle, IonCardHeader, IonCard, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule]
})
export class Tab3Page implements OnInit, OnDestroy {
  gameState: GameState = {
    energy: 0,
    totalEnergy: 0,
    totalClicks: 0,
    energyPerClick: 1,
    energyPerSecond: 0,
    upgrades: []
  };

private subscription!: Subscription;
  resetClickCount = 0;
  private resetTimeout: any;

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
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
  }

  resetGame() {
    this.resetClickCount++;
    
    if (this.resetClickCount === 1) {
      this.resetTimeout = setTimeout(() => {
        this.resetClickCount = 0;
      }, 3000);
    } else if (this.resetClickCount >= 2) {
      clearTimeout(this.resetTimeout);
      this.gameService.resetGame();
      this.resetClickCount = 0;
    }
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return Math.floor(num).toString();
  }

  getTotalUpgradeLevels(): number {
    return this.gameState?.upgrades.reduce((sum, u) => sum + u.level, 0) || 0;
  }

  getClickUpgradeLevels(): number {
    return this.gameState?.upgrades
      .filter(u => u.type === 'click')
      .reduce((sum, u) => sum + u.level, 0) || 0;
  }

  getPassiveUpgradeLevels(): number {
    return this.gameState?.upgrades
      .filter(u => u.type === 'passive')
      .reduce((sum, u) => sum + u.level, 0) || 0;
  }
}