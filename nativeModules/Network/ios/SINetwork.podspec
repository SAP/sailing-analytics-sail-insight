Pod::Spec.new do |s|
  s.name                      = "SINetwork"

  s.version                   = "1.0.0"
  s.license                   = "MIT"
  s.summary                   = "SINetwork"
  s.authors                   = "SI"
  s.homepage                  = "https://SINetwork"

  s.author        = { "author" => "author@domain.cn" }
  s.platform                  = :ios, "9.0"
  s.ios.deployment_target     = "9.0"

  s.source         = { :git => '' }
  s.source_files   = '**/*.{h,m}'
  s.preserve_paths = '**/*.{h,m}'
  s.requires_arc = true

  s.dependency "React"
  s.dependency "AFNetworking"

  #s.dependency "others"

end

