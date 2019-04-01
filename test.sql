\c nc_news;

SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles
LEFT JOIN comments ON comments.belongs_to = articles.title
GROUP BY articles.article_id;