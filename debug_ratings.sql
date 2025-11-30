-- Verificar se há dados na tabela restaurant_ratings
SELECT 
  rr.id,
  rr.client_id,
  rr.restaurant_id,
  rr.stars,
  rr.comment,
  rr.created_at,
  c.name as client_name,
  r.name as restaurant_name
FROM restaurant_ratings rr
LEFT JOIN clients c ON c.id = rr.client_id
LEFT JOIN restaurants r ON r.id = rr.restaurant_id
ORDER BY rr.created_at DESC
LIMIT 10;