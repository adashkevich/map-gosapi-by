Rails.application.routes.draw do

  scope '/api/v1' do
    post 'photos', to: 'photos#create'
    get 'change_requests/decline', to: 'change_requests#decline'
    get 'change_requests/accept', to: 'change_requests#accept'
    resources :items
    resources :change_requests
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
