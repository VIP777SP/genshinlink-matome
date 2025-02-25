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
};

export default function CommentSection({ pageId }: CommentSectionProps) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const renderStars = () => {
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
            className={`text-base sm:text-xl transition-all duration-200 ${
              star <= rating 
                ? 'text-amber-500 transform scale-110' 
                : 'text-gray-300 hover:text-amber-300'
            } focus:outline-none mx-0.5 sm:mx-1`}
            aria-label={`${star}つ星`}
          >
            <i className="fas fa-star"></i>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-6 sm:mt-8 relative overflow-hidden rounded-xl shadow-lg dark:shadow-xl border border-amber-200/50 dark:border-amber-900/30">
      {/* 背景効果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-300/10 dark:bg-amber-700/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-orange-300/10 dark:bg-orange-700/5 rounded-full blur-2xl"></div>
      
      {/* コンテンツ */}
      <div className="relative p-3 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-amber-800 dark:text-amber-400 flex items-center">
          <i className="fas fa-comments mr-2 text-amber-600 dark:text-amber-500"></i>
          コメント・評価
        </h2>

        {/* コメント投稿フォーム */}
        <form 
          onSubmit={handleSubmit} 
          className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-md border border-white/80 dark:border-gray-700/30"
        >
          <div className="mb-4 sm:mb-5">
            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-1.5 sm:mb-2 font-medium">
              お名前
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 text-sm sm:text-base border border-amber-200 dark:border-amber-800/50 rounded-lg 
                        bg-white/70 dark:bg-gray-900/50 dark:text-white focus:outline-none 
                        focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-700 
                        focus:border-transparent transition-all duration-200"
              placeholder="あなたのお名前"
              maxLength={30}
            />
          </div>

          <div className="mb-4 sm:mb-5">
            <label htmlFor="comment" className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-1.5 sm:mb-2 font-medium">
              コメント
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 text-sm sm:text-base border border-amber-200 dark:border-amber-800/50 rounded-lg 
                        min-h-[100px] sm:min-h-[120px] bg-white/70 dark:bg-gray-900/50 dark:text-white focus:outline-none 
                        focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-700 
                        focus:border-transparent transition-all duration-200"
              placeholder="このページについてのコメントや感想を書いてください..."
              maxLength={500}
            />
          </div>

          <div className="mb-4 sm:mb-5">
            <label className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-1.5 sm:mb-2 font-medium">評価</label>
            <div className="p-2 flex justify-center bg-gray-50/80 dark:bg-gray-900/30 rounded-lg">
              {renderStars()}
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 sm:mb-5 p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-lg text-sm sm:text-base flex items-start">
              <i className="fas fa-exclamation-circle mt-0.5 mr-2 text-red-500 dark:text-red-400"></i>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 sm:mb-5 p-3 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-lg text-sm sm:text-base flex items-start">
              <i className="fas fa-check-circle mt-0.5 mr-2 text-green-500 dark:text-green-400"></i>
              <span>{successMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 sm:px-5 py-2 rounded-lg text-white text-sm sm:text-base font-medium 
                      shadow-md hover:shadow-lg transition-all duration-200 
                      ${isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 dark:from-amber-600 dark:to-amber-700 dark:hover:from-amber-700 dark:hover:to-amber-800'
                      }`}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>送信中...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane mr-2"></i>コメントを投稿する
              </>
            )}
          </button>
        </form>

        {/* コメント一覧 */}
        <div className="space-y-4 sm:space-y-5">
          <h3 className="text-lg sm:text-xl font-semibold text-amber-700 dark:text-amber-400 flex items-center">
            <i className="fas fa-list-ul mr-2 text-amber-600 dark:text-amber-500"></i>
            {comments.length > 0 ? `${comments.length}件のコメント` : 'コメントはまだありません'}
          </h3>

          {comments.length === 0 ? (
            <div className="text-center py-10 sm:py-12 text-gray-500 dark:text-gray-400 bg-white/40 dark:bg-gray-800/30 rounded-xl">
              <i className="fas fa-comments text-4xl sm:text-5xl mb-4 sm:mb-5 text-amber-300 dark:text-amber-700 opacity-70"></i>
              <p className="text-sm sm:text-base max-w-xs mx-auto">このページの最初のコメントを投稿してみましょう！あなたの意見や感想をお待ちしています。</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 sm:p-5 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl 
                              shadow-md hover:shadow-lg transition-all duration-300 
                              border border-white/80 dark:border-gray-700/30 
                              relative overflow-hidden group"
                  >
                    {/* ハイライト装飾 */}
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600 dark:from-amber-600 dark:to-amber-800 
                                   rounded-l-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="pl-1.5">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0 mb-3">
                        <div>
                          <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base flex items-center">
                            <i className="fas fa-user text-amber-500 dark:text-amber-400 mr-1.5 opacity-70"></i>
                            {comment.name}
                          </h4>
                          <div className="flex text-amber-500 dark:text-amber-400 mt-1 sm:mt-1.5">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`fas fa-star text-xs sm:text-sm ${
                                  i < comment.rating ? 'text-amber-500 dark:text-amber-400' : 'text-gray-300 dark:text-gray-600'
                                } mr-0.5`}
                              ></i>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0 flex items-center">
                          <i className="far fa-clock mr-1 opacity-70"></i>
                          {new Date(comment.createdAt).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mt-2 whitespace-pre-line pl-0.5">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 