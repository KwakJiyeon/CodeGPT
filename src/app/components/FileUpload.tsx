"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Input, TextField, Typography } from '@mui/material';

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [question, setQuestion] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleUpload = async () => {
    if (!files || !question) {
      setError('Please provide a question and select files to upload.');
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));
    formData.append('question', question);

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
    } catch (error: any) {
      console.error('Error uploading files:', error);
      setError('Error uploading files. Please try again.');
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
