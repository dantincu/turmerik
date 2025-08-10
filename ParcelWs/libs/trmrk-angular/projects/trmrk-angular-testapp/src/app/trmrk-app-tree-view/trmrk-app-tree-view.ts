import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { NullOrUndef } from '../../trmrk/core';

import {
  TreeNode,
  TrmrkAppTreeViewNode,
} from '../trmrk-app-tree-view-node/trmrk-app-tree-view-node';

import { TrmrkTree, TrmrkTreeNodeData } from 'trmrk-angular';

@Component({
  selector: 'trmrk-app-tree-view',
  imports: [TrmrkAppTreeViewNode],
  templateUrl: './trmrk-app-tree-view.html',
  styleUrl: './trmrk-app-tree-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrmrkAppTreeView implements OnInit, OnDestroy {
  @Input() trmrkData!: TrmrkTree<TreeNode>;

  rootNodes!: TrmrkTreeNodeData<TreeNode>[] | NullOrUndef;

  private rootNodesSubscription?: Subscription;

  ngOnInit() {
    this.rootNodes = this.trmrkData.rootNodesData.value;

    this.rootNodesSubscription = this.trmrkData.rootNodesData.$obs.subscribe(
      (data) => {
        this.rootNodes = data;
      }
    );
  }

  ngOnDestroy() {
    this.rootNodesSubscription?.unsubscribe();
  }
}
