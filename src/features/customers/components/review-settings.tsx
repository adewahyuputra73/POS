"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { ReviewQuestion } from "../types";

const MAX_QUESTIONS = 5;

interface ReviewSettingsProps {
  questions: ReviewQuestion[];
  onSave: (questions: ReviewQuestion[]) => void;
}

export function ReviewSettings({ questions: initialQuestions, onSave }: ReviewSettingsProps) {
  const [questions, setQuestions] = useState<ReviewQuestion[]>(initialQuestions);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<ReviewQuestion | null>(null);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const activeCount = questions.filter(q => q.isActive).length;

  const handleAddNew = () => {
    setEditingQuestion(null);
    setNewQuestionText('');
    setDialogOpen(true);
  };

  const handleEdit = (question: ReviewQuestion) => {
    setEditingQuestion(question);
    setNewQuestionText(question.questionText);
    setDialogOpen(true);
  };

  const handleSaveQuestion = () => {
    if (!newQuestionText.trim()) return;

    if (editingQuestion) {
      setQuestions(prev => prev.map(q =>
        q.id === editingQuestion.id
          ? { ...q, questionText: newQuestionText.trim(), updatedAt: new Date().toISOString() }
          : q
      ));
    } else {
      const newQ: ReviewQuestion = {
        id: Date.now(),
        questionText: newQuestionText.trim(),
        isActive: activeCount < MAX_QUESTIONS,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setQuestions(prev => [...prev, newQ]);
    }
    setDialogOpen(false);
  };

  const handleToggleActive = (id: number) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== id) return q;
      if (!q.isActive && activeCount >= MAX_QUESTIONS) return q;
      return { ...q, isActive: !q.isActive, updatedAt: new Date().toISOString() };
    }));
  };

  const handleDelete = (id: number) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    setDeleteConfirmId(null);
  };

  const handleSaveAll = () => {
    onSave(questions);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Pertanyaan Ulasan</h3>
          <p className="text-sm text-text-secondary mt-0.5">
            Kelola pertanyaan yang muncul saat pelanggan memberi ulasan.
            Maksimal <span className="font-medium">{MAX_QUESTIONS}</span> pertanyaan aktif.
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-1.5">
          <Plus className="h-4 w-4" /> Tambah Pertanyaan
        </Button>
      </div>

      {/* Active indicator */}
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${activeCount >= MAX_QUESTIONS ? 'bg-yellow-500' : 'bg-green-500'}`} />
        <span className="text-sm text-text-secondary">
          {activeCount}/{MAX_QUESTIONS} pertanyaan aktif
        </span>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {questions.map((question) => (
          <div
            key={question.id}
            className={`bg-surface rounded-xl border p-4 transition-all ${
              question.isActive ? 'border-primary/20 shadow-sm' : 'border-border opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-text-primary">{question.questionText}</p>
                  {question.isActive ? (
                    <Badge variant="success" className="text-[10px]">Aktif</Badge>
                  ) : (
                    <Badge variant="default" className="text-[10px]">Nonaktif</Badge>
                  )}
                </div>
                <p className="text-xs text-text-disabled">Rating bintang 1-5</p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleActive(question.id)}
                  className={`h-8 text-xs ${question.isActive ? 'text-green-600' : 'text-text-disabled'}`}
                  title={question.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  disabled={!question.isActive && activeCount >= MAX_QUESTIONS}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(question)} className="h-8 w-8 p-0 text-text-disabled hover:text-primary">
                  <Pencil className="h-4 w-4" />
                </Button>
                {deleteConfirmId === question.id ? (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(question.id)} className="h-8 text-xs text-red-600 hover:text-red-700">Hapus</Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmId(null)} className="h-8 text-xs">Batal</Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmId(question.id)} className="h-8 w-8 p-0 text-text-disabled hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        {questions.length === 0 && (
          <div className="bg-surface rounded-xl border border-border p-12 text-center">
            <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-yellow-400" />
            <h3 className="text-sm font-medium text-text-primary">Belum ada pertanyaan</h3>
            <p className="mt-1 text-sm text-text-secondary">Tambahkan pertanyaan untuk menampilkan form review ke pelanggan</p>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveAll} className="gap-1.5 px-6">
          Simpan Perubahan
        </Button>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingQuestion ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="question-text">Pertanyaan</Label>
              <Input
                id="question-text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Contoh: Bagaimana rasa makanan kami?"
              />
              <p className="text-xs text-text-disabled">Pelanggan akan menjawab dengan rating bintang 1-5</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button onClick={handleSaveQuestion} disabled={!newQuestionText.trim()}>
                {editingQuestion ? 'Simpan' : 'Tambah'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
