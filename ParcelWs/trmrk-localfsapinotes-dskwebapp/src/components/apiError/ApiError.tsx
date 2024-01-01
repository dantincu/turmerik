import React from 'react';
import { Box, Typography } from '@mui/material';

import { ApiResponse } from "trmrk-axios/src/core";

import './styles.scss';

export default function ApiError({
  apiResp
}: {
  apiResp: ApiResponse<any>
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h1">
        {apiResp.errTitle}
      </Typography>
      <Typography variant="h6">
        {apiResp.errMessage}
      </Typography>
    </Box>
  );
}
