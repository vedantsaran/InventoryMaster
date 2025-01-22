
require 'sinatra'
require 'json'

$inventory = []
# Get all products
get '/inventory' do
  content_type :json
  $inventory.to_json
end
# Add a new product
post '/inventory' do
  content_type :json
  data = JSON.parse(request.body.read)
  product = {
    id: ($inventory.empty? ? 1 : $inventory.last[:id] + 1),
    name: data['name'],
    stock: data['stock'],
    price: data['price']
  }
  $inventory << product
  product.to_json
end
# Update a product's stock
put '/inventory/:id' do
  content_type :json
  id = params[:id].to_i
  data = JSON.parse(request.body.read)
  product = $inventory.find { |p| p[:id] == id }
  if product
    product[:stock] = data['stock'] if data.key?('stock')
    product.to_json
  else
    halt 404, { error: 'Product not found' }.to_json
  end
end
# Delete a product
delete '/inventory/:id' do
  content_type :json
  id = params[:id].to_i
  product = $inventory.find { |p| p[:id] == id }
  if product
    $inventory.delete(product)
    { message: 'Product deleted' }.to_json
  else
    halt 404, { error: 'Product not found' }.to_json
  end
end
