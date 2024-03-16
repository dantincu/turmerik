import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, TreeItemProps, treeItemClasses } from '@mui/x-tree-view/TreeItem';

import LoadingDotPulse from '../loading/LoadingDotPulse';

// Code taken from https://mui.com/x/react-tree-view

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  bgColorForDarkMode?: string;
  color?: string;
  colorForDarkMode?: string;
  labelIcon?: React.ElementType<SvgIconProps> | null | undefined;
  labelIconEl?: HTMLElement | null | undefined;
  labelText: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
})) as unknown as typeof TreeItem;

const StyledTreeItem = React.forwardRef(function StyledTreeItem(
  props: StyledTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const theme = useTheme();
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelIconEl,
    labelText,
    colorForDarkMode,
    bgColorForDarkMode,
    ...other
  } = props;

  const styleProps = {
    '--tree-view-color': theme.palette.mode !== 'dark' ? color : colorForDarkMode,
    '--tree-view-bg-color':
      theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
  };

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0.5,
            pr: 0,
          }}
        >
          { LabelIcon ? <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} /> : labelIconEl }
          <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {labelText}
          </Typography>
        </Box>
      }
      style={styleProps}
      {...other}
      ref={ref}
    />
  );
});

export interface IndexedDbBrowserProps {
}

export default function IndexedDbBrowser(
  props: IndexedDbBrowserProps) {

  const [ isLoadingRoot, setIsLoadingRoot ] = React.useState(false);
  const [ pinnedTopRowsCount, setPinnedTopRowsCount ] = React.useState(1);

  const [ databases, setDatabases ] = React.useState<IDBDatabaseInfo[] | null>(null);
  const [ error, setError ] = React.useState<Error | any | null>(null);

  const pinnedTopBarRef = React.createRef<HTMLDivElement>();
  const pinnedTopBarBgSpacerRef = React.createRef<HTMLDivElement>();

  const updatePinnedTopBarHeight = (isLoadingRoot: boolean, pinnedTopRowsCount: number) => {
    if (isLoadingRoot) {
      pinnedTopRowsCount++;
    }

    const heightPx = `${pinnedTopRowsCount * 2}em`;
    pinnedTopBarRef.current!.style.height = heightPx;
    pinnedTopBarBgSpacerRef.current!.style.height = heightPx;
  }

  const loadDatabases = () => {
    setIsLoadingRoot(true);
    indexedDB.databases().then(databases => {
      setDatabases(databases);
    }, reason => {
      setError(reason);
    }).finally(() => {
      setIsLoadingRoot(false);
    });
  }

  React.useEffect(() =>{
    updatePinnedTopBarHeight(isLoadingRoot, pinnedTopRowsCount);

    if (!databases && !error) {
      loadDatabases();
    }
  }, [ isLoadingRoot, pinnedTopBarRef, pinnedTopBarBgSpacerRef, databases, error ]);

  return (<div className="trmrk-panel trmrk-indexeddb-browser">
    <Paper className={['trmrk-pinned-top-bar', "trmrk-current-node-hcy", isLoadingRoot ? "trmrk-is-loading" : "" ].join(" ")} ref={pinnedTopBarRef}>
      <span className='trmrk-hcy-root-node-token'>&#47;</span>
      { isLoadingRoot ? <LoadingDotPulse /> : null }
    </Paper>
    <div className={['trmrk-pinned-top-bar-bg-spacer', isLoadingRoot ? "trmrk-is-loading" : "" ].join(" ")} ref={pinnedTopBarBgSpacerRef}>
    </div>
    { databases ? <TreeView
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        sx={{ flexGrow: 1, minWidth: "100%", overflowY: 'auto' }}>
      { databases.map(db => <StyledTreeItem
          nodeId={db.name ?? ""}
          key={db.name}
          labelText={db.name ?? ""}
          labelIconEl={<span className="material-symbols-outlined">database</span>}>
        <span className='trmrk-parent-not-leaf-node'></span>
      </StyledTreeItem>) }
    </TreeView> : null }
  </div>);
}
