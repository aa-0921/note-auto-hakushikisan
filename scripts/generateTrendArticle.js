#!/usr/bin/env node
// scripts/generateTrendArticle.js
// Googleトレンド記事自動生成・自動投稿スクリプト
// Googleトレンドの最初のキーワードを自動取得して記事を生成します

import { runWithCore, GoogleTrendArticleService, Logger } from '@aa-0921/note-auto-core';

// アフィリエイト設定とリンクを別ファイルから読み込み
import { affiliateConfig, affiliateLinks } from './affiliateConfig.js';

(async () => {
  await runWithCore(async ({ core, wantsBackground }) => {
    const logger = new Logger();
    
    logger.info('========================================');
    logger.info('🔥 Googleトレンド記事自動生成・自動投稿');
    logger.info('========================================');
    logger.info('');
    logger.info('キーワード: 自動取得（Googleトレンドの最初のキーワード）');
    logger.info('');
    
    // coreから設定を取得（config/account.yamlから読み込まれた設定）
    const config = core.configManager.config;
    
    // コマンドライン引数からskipPublishオプションを取得
    const argv = process.argv.slice(2);
    const skipPublish = argv.includes('--skip-publish') || argv.includes('--no-publish');
    
    if (skipPublish) {
      logger.info('⏭️  投稿をスキップします（--skip-publish オプション）');
    }
    
    const trendService = new GoogleTrendArticleService(config, logger);
    
    // アソシエイト表記文
    const amazonAssociateText =
      'Amazon のアソシエイトとして、「何でも知ってる博識さん」は適格販売により収入を得ています。';

    // おすすめ記事セクションの設定
    const recommendedArticlesTitle = 'まだまだ為になる！🙇‍♂️他のおすすめ記事🙆‍♂️';
    const recommendedArticlesUrls = [
      'https://note.com/hakushiki_san/n/n507729ba2148',
      'https://note.com/hakushiki_san/n/nc9099ebd3e76',
      'https://note.com/hakushiki_san/n/n198c5b08783b',
      'https://note.com/hakushiki_san/n/nd5c37bbc7e15',
    ];
    
    try {
      // Googleトレンド記事を生成・投稿
      const result = await trendService.generateAndPublishTrendArticle({
        keyword: null, // 常に自動取得
        skipPublish: skipPublish, // 投稿をスキップするかどうか
        affiliateLinks: affiliateLinks, // アフィリエイトリンク
        affiliateConfig: affiliateConfig, // アフィリエイト設定
        amazonAssociateText: amazonAssociateText, // Amazonアソシエイト表記文
        recommendedArticlesTitle: recommendedArticlesTitle, // おすすめ記事セクションのタイトル
        recommendedArticlesUrls: recommendedArticlesUrls, // おすすめ記事のURL配列
        aiOptions: {
          systemMessage: [
            'あなたはプロのコンテンツライターで、ベテランの編集者でもあります。',
            '収集した情報を基に、読みやすく興味深い記事を作成してください。',
          ].join('\n'),
          // 追加の指示部分（基本部分はcore側で自動的に追加される）
          userPrompt: [
            '上記の情報のみを基に、以下の要件で記事を作成してください:',
            '- 収集した情報以外には言及せず、提供された情報のみを使用する',
            '- 見出し（##）を使って構造化する',
            '- 見出しの直後に文章を続け、見出しと本文の間に空行を入れないでください',
            '- 文章の後には改行を2つほど入れるようにしてください',
            '- 各段落の間に適度に改行を入れて読みやすくしてください',
            '- 適切な箇所に絵文字（📝、💡、✨、🎯、📊、💬、🌟など）を入れて視覚的に読みやすくしてください',
            '- 絵文字を付ける場合は、その文の末尾に句読点（。、）をつけないでください（例：「注目が集まります💬」のように）',
            '- 専門用語や重要なキーワードが登場する際は、そのセクションの下部に「【キーワード】キーワード名」という見出し形式で注釈を追加してください',
            '- 注釈には、意味、詳細な説明、関連する数値や具体例を改行で分けて記載してください',
            '- 注釈の各行の先頭に、内容に適した絵文字（📝、💡、✨、🎯、📊、💬、🌟、📌、🔍、📖、💼、⚡、🌊、🌍など）を追加してください',
            '- 注釈の各行の間には必ず空行（改行を2つ）を入れて、読みやすくしてください（例：「【キーワード】積乱雲\n\n⚡ 垂直に発達した雲で、雷や突風、ひょうを伴うことが多い\n\n📊 高度10km以上にまで達することがあり、非常に激しい天気現象を引き起こす\n\n💡 形状は cauliflower（カリフラワー）に似た特徴的な形をしている」のように）',
            '- 略語の場合は正式名称や展開も含めてください',
            '- 情報の要点を分かりやすく説明する',
            '- 収集した情報に対して、無難で建設的な自分の意見や考察を加える',
            '- 情報を解釈し、読者にとって価値のある洞察を提供する',
            '- 記事の最後に、必ず「#博識 #知的 #学習 #情報」の4つのハッシュタグを追加してください',
            '- その後に、記事の内容に関連するキーワードから20個ほどのハッシュタグを追加してください（例：「#経済 #政策 #GDP #市場」など）',
            // ーーーーーーーーーーーーーーーーーーーーー
            // 以下の共通プロンプトはcore側で自動的に追加されます:
            // - 記者やジャーナリストの個人名は記載しない
            // - 有名人の個人名は記載してOK
            // - 最後にまとめを追加
            // - 記事は完全に完成させ、途中で途切れないように
            // - 記事の長さは1500文字以上とし、上限はなし
          ].join('\n'),
          maxTokens: 4000, // トークン数を増やして長文記事に対応
          temperature: 0.7,
        },
        publishOptions: {
          titleEmojis: ['🔥', '📈', '💡', '✨', '🎯', '💕', '❤️'], // タイトルに追加する絵文字
        },
      });
      
      logger.info('');
      logger.info('========================================');
      logger.info('✅ 実行完了');
      logger.info('========================================');
      logger.info(`キーワード: ${result.keyword}`);
      logger.info(`タイトル: ${result.title}`);
      logger.info(`ニュースURL: ${result.newsUrl}`);
      logger.info('');
      
    } catch (error) {
      logger.error('❌ エラーが発生しました:', error.message);
      if (error.stack) {
        logger.error('スタックトレース:', error.stack);
      }
      throw error; // runWithCoreがエラーハンドリングする
    } finally {
      await trendService.cleanup();
    }
  });
})();

