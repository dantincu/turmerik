import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import MailIcon from '@mui/icons-material/Mail';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import Label from '@mui/icons-material/Label';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import InfoIcon from '@mui/icons-material/Info';
import ForumIcon from '@mui/icons-material/Forum';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
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
  labelIcon: React.ElementType<SvgIconProps>;
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
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
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
  const pinnedTopRowRef = React.createRef<HTMLDivElement>();

  React.useEffect(() =>{
    setIsLoadingRoot(true);
  }, [ isLoadingRoot ]);

  return (<div className="trmrk-indexeddb-browser">
    <Paper className={['trmrk-pinned-top-row', isLoadingRoot ? "trmrk-is-loading" : "" ].join(" ")} ref={pinnedTopRowRef}>
      <span className='trmrk-hcy-root-token'>&#47;</span>
      { isLoadingRoot ? <LoadingDotPulse /> : null }
    </Paper>
    <div className={['trmrk-pinned-top-row-bg-spacer', isLoadingRoot ? "trmrk-is-loading" : "" ].join(" ")}>
    </div>
    <TreeView
      aria-label="indexeddb"
      defaultExpanded={[]/* ['3'] */}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultParentIcon={/* <div style={{ width: 24 }}><CircleIcon /></div> */ null }
      defaultEndIcon={/* <div style={{ width: 24 }}><CircleOutlinedIcon /></div> */ null }
      sx={{ flexGrow: 1, minWidth: "100%", overflowY: 'auto' }}
    >
      <StyledTreeItem nodeId="1" labelText="All Mail" labelIcon={MailIcon} />
      <StyledTreeItem nodeId="2" labelText="Trash" labelIcon={DeleteIcon}>
        <span></span>
      </StyledTreeItem>
      <StyledTreeItem nodeId="3" labelText="Categories" labelIcon={Label}>
        <StyledTreeItem
          nodeId="5"
          labelText="Social"
          labelIcon={SupervisorAccountIcon}
          color="#1a73e8"
          bgColor="#e8f0fe"
          colorForDarkMode="#B8E7FB"
          bgColorForDarkMode="#071318"
        />
        <StyledTreeItem
          nodeId="6"
          labelText="Updates"
          labelIcon={InfoIcon}
          color="#e3742f"
          bgColor="#fcefe3"
          colorForDarkMode="#FFE2B7"
          bgColorForDarkMode="#191207"
        />
        <StyledTreeItem
          nodeId="7"
          labelText="Forums"
          labelIcon={ForumIcon}
          color="#a250f5"
          bgColor="#f3e8fd"
          colorForDarkMode="#D9B8FB"
          bgColorForDarkMode="#100719"
        />
        <StyledTreeItem
          nodeId="8"
          labelText="Promotions"
          labelIcon={LocalOfferIcon}
          color="#3c8039"
          bgColor="#e6f4ea"
          colorForDarkMode="#CCE8CD"
          bgColorForDarkMode="#0C130D"
        />
      </StyledTreeItem>
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
      <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
    </TreeView>
  </div>);
}
