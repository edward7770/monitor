import React, { useState } from 'react';
import { IconButton } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const RawRecordCellRenderer = (props) => {
  const fullText = props.value;
  const [isCopied, setIsCopied] = useState(false);
  const previewText = fullText.length > 35 ? `${fullText.substring(0, 35)}...` : fullText;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText).then(
      () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      },
      (err) => console.error('Failed to copy text: ', err)
    );
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>{previewText}</span>
      {fullText.length > 35 && (
        <IconButton
          onClick={handleCopy}
          style={{ marginLeft: 'auto', cursor: 'pointer', border: 'none', background: 'transparent' }}
          title="Copy to clipboard"
        >
          {isCopied ? <DoneAllIcon style={{fontSize: '20px'}} /> : <ContentCopyIcon style={{fontSize: '20px'}} /> }
        </IconButton>
      )}
    </div>
  );
};

export default RawRecordCellRenderer;
