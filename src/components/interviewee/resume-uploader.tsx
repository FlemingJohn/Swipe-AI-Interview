"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Input } from '../ui/input';

interface ResumeUploaderProps {
  onUpload: () => void;
}

export function ResumeUploader({ onUpload }: ResumeUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName('');
    }
  };

  const handleStart = () => {
    setIsLoading(true);
    // Simulate parsing delay
    setTimeout(() => {
      onUpload();
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center h-96">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Begin Your AI Interview</CardTitle>
          <CardDescription>Upload your resume to get started. We'll extract your details.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-muted"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Icons.upload className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PDF or DOCX</p>
              </div>
              <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
            </label>
          </div>
          {fileName && <p className="text-sm text-muted-foreground">Selected file: {fileName}</p>}
          <Button onClick={handleStart} disabled={isLoading || !fileName} size="lg">
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Parsing Resume...
              </>
            ) : (
              'Start Interview'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
