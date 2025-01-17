"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Input, TextField, Typography } from '@mui/material';
import styles from './fileUpload.module.css';

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [question, setQuestion] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleUpload = async () => {
    if (!question) {
      setError('Please provide a question to upload.');
      return;
    }

    const formData = new FormData();
    if(files){
      Array.from(files).forEach(file => formData.append('files', file));
    }
   
    formData.append('question', question);

    setLoading(true);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 1000 * 60 * 10 // 10분 타임아웃
      });
      console.log('Upload response:', res.data);
      setResponse(res.data);
      setError(null);

      setFiles(null);
      setQuestion('');
      (document.getElementById('file') as HTMLInputElement).value = '';
    } catch (error: any) {
      console.error('Error uploading files:', error);
      setError('Error uploading files. Please try again.');
    }
    finally {
      setLoading(false);
    }

  };

  return (
    <div>
      <form >
        <div className={styles.fileInput}>
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
        <Button 
            variant="contained" 
            color="primary" 
            onClick={handleUpload}
            disabled={loading}> 
              {loading ? 'Loading...' : 'Upload'}
        </Button>
      </form>
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      <br />
      <div>
        {response && (
          <div>
            <Typography variant="h6">Response:</Typography>
            <Typography variant="body1">Question: {response.question}</Typography>
            <Typography variant="body1">Prompts:</Typography>
            <pre>{response.prompts.join('\n')}</pre>
            <Typography variant="body1">Answer:</Typography>
            <pre>{response.answer}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;