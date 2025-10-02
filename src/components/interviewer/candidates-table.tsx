"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import type { Candidate } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface CandidatesTableProps {
  candidates: Candidate[];
  onRowClick: (candidate: Candidate) => void;
}

type SortKey = 'name' | 'score' | 'createdAt';

export function CandidatesTable({ candidates, onRowClick }: CandidatesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (a[sortKey] === null || b[sortKey] === null) return 0;
    
    const valA = a[sortKey];
    const valB = b[sortKey];

    if (valA < valB) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (valA > valB) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <Icons.sort className="h-4 w-4 ml-2" />;
    return sortDirection === 'asc' ? 
      <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg> : 
      <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
  };
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('name')}>
                  Candidate {getSortIcon('name')}
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button variant="ghost" onClick={() => handleSort('score')}>
                  Score {getSortIcon('score')}
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">AI Summary</TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort('createdAt')}>
                  Date {getSortIcon('createdAt')}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCandidates.map((candidate) => (
              <TableRow key={candidate.id} onClick={() => onRowClick(candidate)} className="cursor-pointer">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <p>{candidate.name}</p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={candidate.score && candidate.score > 75 ? 'default' : 'secondary'}>
                    {candidate.score ?? 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-sm">
                  <p className="truncate text-muted-foreground">{candidate.summary}</p>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatDistanceToNow(new Date(candidate.createdAt), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
