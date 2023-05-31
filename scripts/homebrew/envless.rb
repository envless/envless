class Envless < Formula
  desc ""
  homepage "https://envless.dev"
  url "https://example.com/foo-0.1.tar.gz"
  sha256 "85cc828a96735bdafcf29eb6291ca91bac846579bcef7308536e0c875d6c81d7"

  def install
  end

  test do
    system "#{bin}/envless version"
  end
end
