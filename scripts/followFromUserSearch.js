// follow/followFromUserSearch.js
// 薄いラッパー：既存のCLI引数・動作は維持しつつ、実装は共有ライブラリに委譲

import { runWithCore } from '@aa-0921/note-auto-core';

(async () => {
  await runWithCore(async ({ core, wantsBackground }) => {
    // アカウント固有の検索ワード配列（ここで管理）
    const searchWords = [
      'フォロバ',
      'フォロバ',
      'フォロバ',
      'フォロバ',
      'フォロバ',
      'ママ',
      '子育て',
      '育児',
      'JK',
      '恋愛',
      '教育',
      '感謝',
      '料理',
      'ヨガ',
      'カフェ',
      '節約',
      '貯金',
      '断捨離',
      '美容',
      'ダイエット',
      'ママ友',
      '引き寄せ',
    ];

    await core.runFollowFromUserSearch({
      background: wantsBackground,
      maxFollows: 15,
      // コア側で options.searchWords を優先使用
      searchWords,
    });
    console.log('フォロー処理が完了しました');
  });
})();

