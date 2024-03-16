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
  idx: number;
  lvlIdx: number;
  bgColor?: string;
  bgColorForDarkMode?: string;
  borderColor?: string;
  borderColorForDarkMode?: string;
  borderAltColor?: string;
  borderAltColorForDarkMode?: string;
  color?: string;
  colorForDarkMode?: string;
  labelIcon?: React.ElementType<SvgIconProps> | null | undefined;
  labelIconEl?: HTMLElement | null | undefined;
  labelText: string;
  labelWeight?: "bold" | "regular" | null | undefined
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
    idx,
    lvlIdx,
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
    labelWeight,
    ...other
  } = props;

  const isLightMode = theme.palette.mode !== 'dark';
  console.log("isLightMode", isLightMode);

  const styleProps = {
    '--tree-view-color': isLightMode ? color : colorForDarkMode,
    '--tree-view-bg-color': isLightMode ? bgColor : bgColorForDarkMode,
  };

  const bottomBorderColor = isLightMode ? borderColor : borderColorForDarkMode;
  console.log("bottomBorderColor", bottomBorderColor, borderColor, borderColorForDarkMode);
  const bottomBorderAltColor = isLightMode ? borderAltColor : borderAltColorForDarkMode;
  const bottomBorderColorValue = (idx % 2) === (lvlIdx % 2) ? bottomBorderColor : bottomBorderAltColor;
  console.log("bottomBorderColorValue", bottomBorderColorValue);

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
          <Typography variant="body2" sx={{ fontWeight: labelWeight ?? 'inherit', flexGrow: 1,
            height: "1.66em", borderBottom: `1px solid ${bottomBorderColorValue}` }}>
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
    { databases ? <TreeView className="trmrk-tree-view trmrk-indexeddb-tree-view"
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        sx={{ flexGrow: 1, minWidth: "100%" }}>
      { databases.map((db, idx) => <StyledTreeItem
          idx={idx}
          lvlIdx={0}
          borderColor="#bb8"
          borderColorForDarkMode='#440'
          borderAltColor="#dd8"
          borderAltColorForDarkMode='#220'
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
