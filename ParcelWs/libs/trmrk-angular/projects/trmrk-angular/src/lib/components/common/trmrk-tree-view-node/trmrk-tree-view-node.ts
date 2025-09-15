import {
  Component,
  Input,
  TemplateRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { NullOrUndef } from '../../../../trmrk/core';

import {
  TrmrkTree,
  TrmrkTreeNode,
  TrmrkTreeNodeData,
} from '../../../services/TrmrkTree';

@Component({
  selector: 'trmrk-tree-view-node',
  imports: [CommonModule],
  templateUrl: './trmrk-tree-view-node.html',
  styleUrl: './trmrk-tree-view-node.scss',
})
export class TrmrkTreeViewNode implements OnInit, OnDestroy {
  @Input() trmrkTreeData!: TrmrkTree<any>;
  @Input() trmrkData!: TrmrkTreeNode<any>;
  @Input() trmrkPath!: number[];
  @Input() contentTemplate!: TemplateRef<any>;
  @Input() childNodeTemplate!: TemplateRef<any>;

  data!: TrmrkTreeNodeData<any>;
  childNodes?: TrmrkTreeNodeData<any>[] | NullOrUndef;

  get showChildNodes() {
    const showChildNodes = !!(
      this.childNodes &&
      this.trmrkData.childNodes &&
      this.trmrkData.data.value.isExpanded
    );

    return showChildNodes;
  }

  ngOnInit() {
    this.data = this.trmrkData.data.value;
    this.childNodes = this.trmrkData.childNodesData?.value;
  }

  ngOnDestroy(): void {
    this.trmrkTreeData = null!;
    this.trmrkData = null!;
    this.contentTemplate = null!;
    this.childNodeTemplate = null!;
    this.data = null!;
    this.childNodes = null!;
  }

  getChildNodePath(idx: number) {
    const childNodePath = [...this.trmrkPath, idx];
    return childNodePath;
  }
}
