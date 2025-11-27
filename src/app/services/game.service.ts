import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  currentCost: number;
  effect: number;
  level: number;
  type: 'click' | 'passive';
  icon: string;
}

export interface GameState {
  energy: number;
  totalEnergy: number;
  totalClicks: number;
  energyPerClick: number;
  energyPerSecond: number;
  upgrades: Upgrade[];
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly STORAGE_KEY = 'planetClickerSave';
  private passiveInterval: any;

  private gameState: GameState = {
    energy: 0,
    totalEnergy: 0,
    totalClicks: 0,
    energyPerClick: 1,
    energyPerSecond: 0,
    upgrades: [
      {
        id: 'click1',
        name: 'Silnější prsty',
        description: '+1 energie za klik',
        baseCost: 10,
        currentCost: 10,
        effect: 1,
        level: 0,
        type: 'click',
        icon: 'finger-print'
      },
      {
        id: 'click2',
        name: 'Energetický náboj',
        description: '+5 energie za klik',
        baseCost: 150,
        currentCost: 150,
        effect: 5,
        level: 0,
        type: 'click',
        icon: 'flash'
      },
      {
        id: 'click3',
        name: 'Kvantový akcelerátor',
        description: '+25 energie za klik',
        baseCost: 1000,
        currentCost: 1000,
        effect: 25,
        level: 0,
        type: 'click',
        icon: 'nuclear'
      },
      {
        id: 'passive1',
        name: 'Solární panel',
        description: '+1 energie/s',
        baseCost: 15,
        currentCost: 15,
        effect: 1,
        level: 0,
        type: 'passive',
        icon: 'sunny'
      },
      {
        id: 'passive2',
        name: 'Větrná turbína',
        description: '+5 energie/s',
        baseCost: 200,
        currentCost: 200,
        effect: 5,
        level: 0,
        type: 'passive',
        icon: 'planet'
      },
      {
        id: 'passive3',
        name: 'Fúzní reaktor',
        description: '+20 energie/s',
        baseCost: 1500,
        currentCost: 1500,
        effect: 20,
        level: 0,
        type: 'passive',
        icon: 'radio'
      },
      {
        id: 'passive4',
        name: 'Dysonova sféra',
        description: '+100 energie/s',
        baseCost: 10000,
        currentCost: 10000,
        effect: 100,
        level: 0,
        type: 'passive',
        icon: 'planet-outline'
      }
    ]
  };

  private gameState$ = new BehaviorSubject<GameState>(this.gameState);
  public state$ = this.gameState$.asObservable();

  constructor() {
    this.loadGame();
    this.startPassiveIncome();
  }

  click(): void {
    this.gameState.energy += this.gameState.energyPerClick;
    this.gameState.totalEnergy += this.gameState.energyPerClick;
    this.gameState.totalClicks++;
    this.updateState();
    this.saveGame();
  }

  buyUpgrade(upgradeId: string): boolean {
    const upgrade = this.gameState.upgrades.find(u => u.id === upgradeId);
    if (!upgrade || this.gameState.energy < upgrade.currentCost) {
      return false;
    }

    this.gameState.energy -= upgrade.currentCost;
    upgrade.level++;

    if (upgrade.type === 'click') {
      this.gameState.energyPerClick += upgrade.effect;
    } else {
      this.gameState.energyPerSecond += upgrade.effect;
    }

    upgrade.currentCost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.level));

    this.updateState();
    this.saveGame();
    return true;
  }

  private startPassiveIncome(): void {
    this.passiveInterval = setInterval(() => {
      if (this.gameState.energyPerSecond > 0) {
        const income = this.gameState.energyPerSecond / 10;
        this.gameState.energy += income;
        this.gameState.totalEnergy += income;
        this.updateState();
      }
    }, 100);
  }

  resetGame(): void {
      this.gameState = {
        energy: 0,
        totalEnergy: 0,
        totalClicks: 0,
        energyPerClick: 1,
        energyPerSecond: 0,
        upgrades: this.gameState.upgrades.map(u => ({
          ...u,
          level: 0,
          currentCost: u.baseCost
        }))
      };
      this.updateState();
      this.saveGame();
  }

  private updateState(): void {
    this.gameState$.next({ ...this.gameState });
  }

  private saveGame(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.gameState));
  }

  private loadGame(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const loaded = JSON.parse(saved);
        this.gameState.energy = loaded.energy || 0;
        this.gameState.totalEnergy = loaded.totalEnergy || 0;
        this.gameState.totalClicks = loaded.totalClicks || 0;
        this.gameState.energyPerClick = loaded.energyPerClick || 1;
        this.gameState.energyPerSecond = loaded.energyPerSecond || 0;
        
        loaded.upgrades?.forEach((savedUpgrade: any) => {
          const upgrade = this.gameState.upgrades.find(u => u.id === savedUpgrade.id);
          if (upgrade) {
            upgrade.level = savedUpgrade.level;
            upgrade.currentCost = savedUpgrade.currentCost;
          }
        });
        
        this.updateState();
      } catch (e) {
        console.error('Chyba při načítání uložené hry:', e);
      }
    }
  }

  getState(): GameState {
    return this.gameState;
  }

  ngOnDestroy(): void {
    if (this.passiveInterval) {
      clearInterval(this.passiveInterval);
    }
  }
}