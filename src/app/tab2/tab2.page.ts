import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService, GameState, Upgrade } from '../services/game.service';
import { Subscription } from 'rxjs';
import { IonHeader, IonIcon, IonSegmentButton, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonSegment, IonLabel, IonBadge, IonChip, IonButton } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonButton, IonChip, IonBadge, IonLabel, IonSegment, IonCardContent, IonCard, IonContent, IonTitle, IonToolbar, IonHeader, IonIcon, IonSegmentButton, CommonModule]
})
export class Tab2Page implements OnInit, OnDestroy {
  gameState: GameState = {
    energy: 0,
    totalEnergy: 0,
    totalClicks: 0,
    energyPerClick: 1,
    energyPerSecond: 0,
    upgrades: []
  };
  private subscription!: Subscription;
  selectedSegment: 'click' | 'passive' = 'click';

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

  get clickUpgrades(): Upgrade[] {
    return this.gameState?.upgrades.filter(u => u.type === 'click') || [];
  }

  get passiveUpgrades(): Upgrade[] {
    return this.gameState?.upgrades.filter(u => u.type === 'passive') || [];
  }

  buyUpgrade(upgradeId: string) {
    const success = this.gameService.buyUpgrade(upgradeId);
    if (!success) {
      console.log('Nedostatek energie!');
    }
  }

  canAfford(upgrade: Upgrade): boolean {
    return this.gameState?.energy >= upgrade.currentCost;
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return Math.floor(num).toString();
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }
}