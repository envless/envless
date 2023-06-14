require "language/node"

class Envless < Formula
  desc ""
  homepage "https://envless.dev"
  url "__INTEL_DOWNLOAD_URL__"
  sha256 "__INTEL_SHA256__"
  depends_on "node"

  on_macos do
    if Hardware::CPU.arm?
      url "__M1_DOWNLOAD_URL__"
      sha256 "__M1_SHA256__"
    end
  end

 def install
     inreplace "bin/envless", /^CLIENT_HOME=/, "export ENVLESS_OCLIF_CLIENT_HOME=#{lib/"client"}\nCLIENT_HOME="
     libexec.install Dir["*"]
     bin.install_symlink libexec/"bin/envless"
  end

  test do
    system "#{bin}/envless version"
  end
end
