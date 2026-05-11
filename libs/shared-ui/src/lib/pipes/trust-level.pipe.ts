import { Pipe, PipeTransform } from '@angular/core';
import { TrustLevel } from '@dcms/shared-types';

@Pipe({
  name: 'trustLevelPipe',
  standalone: true,
})
export class TrustLevelPipe implements PipeTransform {
  transform(value: TrustLevel): string {
    const labels: Record<TrustLevel, string> = {
      [TrustLevel.Bronze]: '🥉 Bronze',
      [TrustLevel.Silver]: '🥈 Silver',
      [TrustLevel.Gold]: '🥇 Gold',
      [TrustLevel.Platinum]: '💎 Platinum',
    };
    return labels[value] || value;
  }
}
