'use client';

import { useState, useEffect } from 'react';
import { useSound } from './SoundService';

// コメントの型定義
type Comment = {
  id: string;
  name: string;
  content: string;
  rating: number;
  createdAt: number;
};

type CommentSectionProps = {
  pageId: string;
  pageTitle: string;
};

export default function CommentSection({ pageId, pageTitle }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { playSound } = useSound();

  // コメント読み込み
  useEffect(() => {
    loadComments();
  }, [pageId]);

  // ローカルストレージからコメントをロード
  const loadComments = () => {
    try {
      const savedComments = localStorage.getItem(`comments-${pageId}`);
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
    } catch (error) {
      console.error('コメントの読み込みに失敗しました', error);
    }
  };

  // コメントを保存
  const saveComments = (updatedComments: Comment[]) => {
    try {
      localStorage.setItem(`comments-${pageId}`, JSON.stringify(updatedComments));
      setComments(updatedComments);
    } catch (error) {
      console.error('コメントの保存に失敗しました', error);
    }
  };

  // コメント送信
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    // バリデーション
    if (!name.trim()) {
      setErrorMessage('お名前を入力してください');
      setIsSubmitting(false);
      return;
    }

    if (!newComment.trim()) {
      setErrorMessage('コメントを入力してください');
      setIsSubmitting(false);
      return;
    }

    // 新しいコメントオブジェクト
    const comment: Comment = {
      id: Date.now().toString(),
      name: name.trim(),
      content: newComment.trim(),
      rating,
      createdAt: Date.now(),
    };

    // コメント追加
    const updatedComments = [...comments, comment];
    saveComments(updatedComments);
    
    // フォームリセット
    setNewComment('');
    setRating(5);
    
    // 成功メッセージ表示
    setSuccessMessage('コメントが投稿されました！');
    
    // 効果音再生
    playSound('click');
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
    
    setIsSubmitting(false);
  };

  // 星評価のレンダリング
  const renderStars = (value: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => {
              setRating(star);
              playSound('hover');
            }}
            className={`text-xl ${
              star <= rating ? 'text-amber-500' : 'text-gray-300'
            } focus:outline-none transition-colors`}
            aria-label={`${star}つ星`}
          >
            <i className="fas fa-star"></i>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8 p-4 bg-amber-50 dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-amber-800 dark:text-amber-300">コメント・評価</h2>

      {/* コメント投稿フォーム */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">
            お名前
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-amber-300 dark:border-amber-700 rounded dark:bg-gray-700 dark:text-white"
            placeholder="あなたのお名前"
            maxLength={30}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 dark:text-gray-300 mb-2">
            コメント
          </label>
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border border-amber-300 dark:border-amber-700 rounded min-h-32 dark:bg-gray-700 dark:text-white"
            placeholder="このページについてのコメントや感想を書いてください..."
            maxLength={500}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">評価</label>
          {renderStars(rating)}
        </div>

        {errorMessage && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            <i className="fas fa-check-circle mr-2"></i>
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-lg text-white font-medium ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800'
          } transition-colors`}
        >
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>送信中...
            </>
          ) : (
            'コメントを投稿する'
          )}
        </button>
      </form>

      {/* コメント一覧 */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-400">
          {comments.length > 0 ? `${comments.length}件のコメント` : 'コメントはまだありません'}
        </h3>

        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <i className="fas fa-comments text-4xl mb-4 text-amber-300 dark:text-amber-700"></i>
            <p>このページの最初のコメントを投稿してみましょう！</p>
          </div>
        ) : (
          comments
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((comment) => (
              <div
                key={comment.id}
                className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm border-l-4 border-amber-500"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">{comment.name}</h4>
                    <div className="flex text-amber-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star text-sm ${
                            i < comment.rating ? 'text-amber-500' : 'text-gray-300'
                          }`}
                        ></i>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-line">{comment.content}</p>
              </div>
            ))
        )}
      </div>
    </div>
  );
} 