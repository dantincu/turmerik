import React, { useEffect, useState } from "react";

import { core as trmrk } from "trmrk";

const FilesHcy = ({
    rootDirPath,
    crntDirPath
  }: {
    rootDirPath ?: string | null | undefined,
    crntDirPath ?: string | null | undefined
  }) => {
  if (trmrk.isNonEmptyStr(crntDirPath, true)) { 
    
  }
  return (<div></div>);
}

export default FilesHcy;
