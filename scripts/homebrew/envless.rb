class Envless < Formula
  desc ""
  homepage "https://envless.dev"
  url "__DOWNLOAD_URL__"
  sha256 "__SHA256__"

  def install
  end

  test do
    system "#{bin}/envless version"
  end
end
