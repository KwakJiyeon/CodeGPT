"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Input, TextField, } from '@mui/material';

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [response,setResponse] = useState<any>(null);
  const [question, setQuestion] = useState<string>('');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleUpload = async () => {
    if (!files) return;
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));
    formData.append('question', question);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload response:', res.data);
      setResponse(res.data);

      setFiles(null);
      setQuestion('');
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div>
        <form>
            <div>
                <Input id="file" name="file" type="file" inputProps={{ multiple: true }} onChange={handleFileChange} />
            </div>
            <div>
            <TextField
                id="question"
                name="question"
                type="text"
                placeholder="Enter your question"
                value={question}
                onChange={handleQuestionChange}
                fullWidth
            />
            </div>
            <Button variant="contained" color="primary" onClick={handleUpload}>Upload</Button>
        </form>
        <br/>
        <div>
            {response}
        </div>
    </div>
    
  );
};

export default FileUpload;