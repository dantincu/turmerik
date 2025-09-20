import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrmrkAppPage } from 'trmrk-angular';

import {
  TrmrkTree,
  TrmrkTreeNode,
  TrmrkTreeNodeData,
  TrmrkTreeNodeEvent,
  TrmrkTreeNodeEventCore,
} from 'trmrk-angular';

import { services } from 'trmrk-angular';

const trmrkTreeEventHandlers = services.common.trmrkTreeEventHandlers;
const TrmrkObservable = services.common.TrmrkObservable;

import { getNextIdx } from '../../../../trmrk/math';
import { queryMx } from '../../../../trmrk/arr';
import { TouchOrMouseCoords } from '../../../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TreeNode } from './trmrk-app-tree-view-node/trmrk-app-tree-view-node';
import { TrmrkAppTreeView } from './trmrk-app-tree-view/trmrk-app-tree-view';

import { companies } from '../../../services/companies';

@Component({
  selector: 'trmrk-app-tree-page',
  imports: [CommonModule, TrmrkAppPage, TrmrkAppTreeView],
  templateUrl: './trmrk-app-tree-page.html',
  styleUrl: './trmrk-app-tree-page.scss',
})
export class TrmrkAppTreePage {
  companies = [...companies];
  treeViewData: TrmrkTree<TreeNode>;

  constructor() {
    this.treeViewData = this.getTreeViewData();
  }

  private getTreeViewData() {
    const dim = 4;
    const retArr: TrmrkTreeNodeData<TreeNode>[] = [];

    const createFakeTreeNodeData = () =>
      ({
        nodeValue: {
          id: -1,
          text: '',
        },
        path: [],
      } as TrmrkTreeNodeData<TreeNode>);

    const retData: TrmrkTree<TreeNode> = {
      rootNodes: [],
      rootNodesData: new TrmrkObservable<TrmrkTreeNodeData<TreeNode>[]>(retArr),
      nodeExpandedToggled: new TrmrkObservable<
        TrmrkTreeNodeEvent<TreeNode, boolean, any>
      >({
        data: createFakeTreeNodeData(),
        path: [],
        event: null,
        value: false,
      }),
      nodeCheckBoxToggled: new TrmrkObservable<
        TrmrkTreeNodeEvent<TreeNode, boolean, any>
      >({
        data: createFakeTreeNodeData(),
        path: [],
        event: null,
        value: false,
      }),
      nodeIconShortPressOrLeftClick: new TrmrkObservable<
        TrmrkTreeNodeEventCore<TreeNode>
      >({
        data: createFakeTreeNodeData(),
        path: [],
        event: null,
      }),
      nodeIconLongPressOrRightClick: new TrmrkObservable<
        TrmrkTreeNodeEventCore<TreeNode>
      >({
        data: createFakeTreeNodeData(),
        path: [],
        event: null,
      }),
      nodeColorLabelShortPressOrLeftClick: new TrmrkObservable<
        TrmrkTreeNodeEventCore<TreeNode>
      >({
        data: createFakeTreeNodeData(),
        path: [],
        event: null,
      }),
      nodeColorLabelLongPressOrRightClick: new TrmrkObservable<
        TrmrkTreeNodeEventCore<TreeNode>
      >({
        data: createFakeTreeNodeData(),
        path: [],
        event: null,
      }),
      nodeTextShortPressOrLeftClick: new TrmrkObservable<
        TrmrkTreeNodeEventCore<TreeNode>
      >({
        data: createFakeTreeNodeData(),
        path: [],
        event: null,
      }),
      nodeTextLongPressOrRightClick: new TrmrkObservable<
        TrmrkTreeNodeEventCore<TreeNode>
      >({
        data: createFakeTreeNodeData(),
        path: [],
        event: null,
      }),
    };

    retData.nodeExpandedToggled.subscribe((event) =>
      trmrkTreeEventHandlers.nodeExpandedToggled(retData, event)
    );

    retData.nodeTextLongPressOrRightClick.subscribe((event) =>
      this.nodeTextLongPressOrRightClick(retData, event)
    );

    const createItem = (
      path: number[],
      isExpanded: boolean,
      isHcyNode = true
    ) => {
      const idx = path.at(-1)!;

      const nodeItem: TrmrkTreeNodeData<TreeNode> = {
        nodeValue: {
          id: idx,
          text: this.companies[getNextIdx([4, 4, 4, 4], path)],
        },
        isHcyNode,
        isExpanded,
      };

      return nodeItem;
    };

    const createFakeItem = (idx: number) =>
      ({
        nodeValue: {
          id: idx,
        },
      } as TrmrkTreeNodeData<TreeNode>);

    const createNode = (
      item: TrmrkTreeNodeData<TreeNode>
    ): TrmrkTreeNode<TreeNode> => ({
      data: new TrmrkObservable<TrmrkTreeNodeData<TreeNode>>(item),
      childNodes: [],
      childNodesData: new TrmrkObservable<TrmrkTreeNodeData<TreeNode>[]>([]),
    });

    for (let i = 0; i < dim; i++) {
      const expand1 = i % 2 === 0;
      const item1 = createItem([i], expand1);
      const node1 = createNode(item1);
      retArr.push(createFakeItem(i));
      retData.rootNodes.push(node1);

      for (let j = 0; j < dim; j++) {
        const expand2 = expand1 && j % 2 === 0;
        const item2 = createItem([i, j], expand2);
        const node2 = createNode(item2);
        node1.childNodesData!.value.push(createFakeItem(j));
        node1.childNodes!.push(node2);

        for (let k = 0; k < dim; k++) {
          const expand3 = expand2 && k % 2 === 0;
          const item3 = createItem([i, j, k], expand3);
          const node3 = createNode(item3);
          node2.childNodesData!.value.push(createFakeItem(k));
          node2.childNodes!.push(node3);

          for (let l = 0; l < dim; l++) {
            const item4 = createItem([i, j, k, l], false, false);
            const node4 = createNode(item4);
            node3.childNodesData!.value.push(createFakeItem(l));
            node3.childNodes!.push(node4);
          }
        }
      }
    }

    return retData;
  }

  nodeTextLongPressOrRightClick(
    treeData: TrmrkTree<TreeNode>,
    event: TrmrkTreeNodeEventCore<TreeNode, TouchOrMouseCoords>
  ) {
    const lastIdx = event.path.at(-1)!;
    const prPath = event.path.slice(0, -1);

    let childNodes: TrmrkTreeNode<TreeNode>[];
    // let childNodesObs: TrmrkObservable<TrmrkTreeNodeData<TreeNode>[]>;
    let childNodesObs: any;

    if (prPath.length > 0) {
      const prNode = queryMx(treeData.rootNodes, 'childNodes', prPath)!;
      childNodes = prNode.childNodes!;
      childNodesObs = prNode.childNodesData!;
    } else {
      childNodes = treeData.rootNodes;
      childNodesObs = treeData.rootNodesData;
    }

    childNodes.splice(lastIdx, 1);
    const childNodesData = [...childNodesObs.value];
    childNodesData.splice(lastIdx, 1);
    childNodesObs.next(childNodesData);
  }
}
