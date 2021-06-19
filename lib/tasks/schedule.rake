desc "Pings PING_URL to keep a dyno alive"
task :dyno_ping do
  require "net/http"
  if ENV['https://rankachu.herokuapp.com/']
    uri = URI(ENV['https://rankachu.herokuapp.com/'])
    Net::HTTP.get_response(uri)
  end
end