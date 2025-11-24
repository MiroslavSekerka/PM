import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService, GameState } from '../services/game.service';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonIcon, IonCardContent, IonList, IonItem, IonLabel, IonButton, IonText } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonText, IonButton, IonLabel, IonItem, IonList, IonCardContent, IonIcon, IonCardTitle, IonCardHeader, IonCard, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule]
})
export class Tab3Page implements OnInit, OnDestroy {
  gameState!: GameState;
  private subscription!: Subscription;

  constructor(
    private gameService: GameService,
    private alertController: AlertController
  ) {}

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

  async resetGame() {
    const alert = await this.alertController.create({
      header: 'Reset hry',
      message: 'Opravdu chceš resetovat celou hru? Přijdeš o veškerý progres!',
      buttons: [
        {
          text: 'Zrušit',
          role: 'cancel'
        },
        {
          text: 'Resetovat',
          role: 'destructive',
          handler: () => {
            this.gameService.resetGame();
          }
        }
      ]
    });

    await alert.present();
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