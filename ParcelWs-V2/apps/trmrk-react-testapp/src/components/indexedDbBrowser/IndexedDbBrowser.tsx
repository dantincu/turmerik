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
  className?: string | null | undefined;
  idx: number;
  lvlIdx: number;
  bgColor?: string;
  bgColorForDarkMode?: string;
  border?: string | null | undefined;
  borderColor?: string | null | undefined;
  borderColorForDarkMode?: string | null | undefined;
  borderAltColor?: string | null | undefined;
  borderAltColorForDarkMode?: string | null | undefined;
  color?: string;
  colorForDarkMode?: string;
  labelColor?: string;
  labelColorForDarkMode?: string;
  labelIcon?: React.ElementType<SvgIconProps> | null | undefined;
  labelIconEl?: HTMLElement | null | undefined;
  labelText: string;
  labelWeight?: "bold" | "regular" | null | undefined
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background,
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: theme.palette.background,
    }
    /* '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.background})`,
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
    }, */
  },
})) as unknown as typeof TreeItem;

const StyledTreeItem = React.forwardRef(function StyledTreeItem(
  props: StyledTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const labelRef = React.createRef<HTMLSpanElement>();

  const theme = useTheme();
  const {
    idx,
    lvlIdx,
    border,
    borderColor,
    borderColorForDarkMode,
    borderAltColor,
    borderAltColorForDarkMode,
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelIconEl,
    labelText,
    colorForDarkMode,
    bgColorForDarkMode,
    labelColor,
    labelColorForDarkMode,
    labelWeight,
    ...other
  } = props;

  const isLightMode = theme.palette.mode !== 'dark';

  const styleProps = {
    '--tree-view-color': isLightMode ? color : colorForDarkMode,
    '--tree-view-bg-color': isLightMode ? bgColor : bgColorForDarkMode,
  };

  let bottomBorder = "";

  if (border) {
    const bottomBorderColor = isLightMode ? borderColor : borderColorForDarkMode;
    const bottomBorderAltColor = isLightMode ? borderAltColor : borderAltColorForDarkMode;
    const bottomBorderColorValue = (idx % 2) === (lvlIdx % 2) ? bottomBorderColor : bottomBorderAltColor;
    bottomBorder = `${border} ${bottomBorderColorValue}`;
  }

  const labelColorValue = isLightMode ? labelColor : labelColorForDarkMode;

  const labelClick = (event: MouseEvent) => {
    event.stopPropagation();
  }

  React.useEffect(() => {
    const labelEl = labelRef.current!;
    
    labelEl.addEventListener("mousedown", labelClick);
    labelEl.addEventListener("click", labelClick);

    return () => {
      labelEl.removeEventListener("mousedown", labelClick);
      labelEl.removeEventListener("click", labelClick);
    };
  }, [ labelRef ]);

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
          <Typography className='trmrk-label' variant="body2" sx={{ fontWeight: labelWeight ?? 'inherit', flexGrow: 1,
            height: "1.66em", borderBottom: bottomBorder, color: labelColorValue ?? "" }} onClick={labelClick} ref={labelRef}>
            {labelText}
          </Typography>
          { /* <Box className='trmrk-border' sx={{
            display: "block",
            position: "absolute",
            height: "1px",
            top: "2em",
            left: "0em",
            right: "0em",
            backgroundColor: bottomBorderColorValue }}></Box> */ }
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
      databases.sort((a, b) => a.name!.localeCompare(b.name!));
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
    </Paper>
    <div className={['trmrk-pinned-top-bar-bg-spacer', isLoadingRoot ? "trmrk-is-loading" : "" ].join(" ")} ref={pinnedTopBarBgSpacerRef}>
    </div>
    { databases ? <TreeView className="trmrk-tree-view trmrk-indexeddb-tree-view"
        defaultCollapseIcon={<ArrowDropDownIcon className='trmrk-mat-icon trmrk-mat-icon-arrow-drop-down' />}
        defaultExpandIcon={<ArrowRightIcon className='trmrk-mat-icon trmrk-mat-icon-arrow-right' />}
        sx={{ flexGrow: 1, minWidth: "100%" }}>
      { databases.map((db, idx) => <StyledTreeItem
          className='trmrk-tree-node trmrk-indexeddb-tree-node'
          idx={idx}
          lvlIdx={0}
          border="1px none"
          labelColor='#880'
          labelColorForDarkMode='#880'
          labelWeight="bold"
          nodeId={db.name ?? ""}
          key={db.name}
          labelText={db.name ?? ""}
          labelIconEl={<span className="trmrk-icon trmrk-icon-database material-symbols-outlined">database</span>}>
        <span className='trmrk-parent-not-leaf-node'></span>
      </StyledTreeItem>) }
    </TreeView> : null }
  </div>);
}
