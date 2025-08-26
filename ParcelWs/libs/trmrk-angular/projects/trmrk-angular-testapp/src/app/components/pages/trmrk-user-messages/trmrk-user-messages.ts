import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrmrkAppPage, TrmrkUserMessage } from 'trmrk-angular';

import { UserMessageLevel } from '../../../../trmrk/core';

@Component({
  selector: 'trmrk-user-messages',
  imports: [CommonModule, TrmrkAppPage, TrmrkUserMessage],
  templateUrl: './trmrk-user-messages.html',
  styleUrl: './trmrk-user-messages.scss',
})
export class TrmrkUserMessages {
  showUserMsg = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

  mainUserMessageStr = '';
  showMainUserMessage = 0;
  mainUserMessageLevel = UserMessageLevel.Info;

  userMessageClose(idx: number) {
    setTimeout(() => {
      const msgElCollection =
        document.getElementsByTagName('trmrk-user-message');
      const msgEl = msgElCollection[idx];

      this.mainUserMessageStr = `Message box with index ${idx} closed and now it has
        clientHeight ${msgEl.clientHeight} and clientWidth ${msgEl.clientWidth}`;

      this.showMainUserMessage++;
      this.mainUserMessageLevel = UserMessageLevel.Info;
    }, 0);

    setTimeout(() => {
      this.showUserMsg[idx]++;
    }, 1000);
  }
}
