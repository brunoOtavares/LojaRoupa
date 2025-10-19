import { Link } from "wouter";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="black-bg border-t gold-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo e informações da loja */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src="/logoheader.png"
                alt="Michel Multimarcas Logo"
                className="w-16 h-16 object-contain filter brightness-0 invert"
              />
              <h3 className="text-2xl font-oswald font-bold gold-accent uppercase tracking-wide">
                Michel Multimarcas
              </h3>
            </div>
            <p className="text-white/80 font-roboto leading-relaxed">
              Estilo masculino sofisticado com as melhores marcas. Qualidade e elegância que definem sua presença.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-primary transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-primary transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-primary transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Úteis */}
          <div className="space-y-6">
            <h4 className="text-xl font-oswald font-bold gold-accent uppercase tracking-wide">
              Links Úteis
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/80 hover:text-primary transition-colors duration-300 font-roboto">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/destaques" className="text-white/80 hover:text-primary transition-colors duration-300 font-roboto">
                  Destaques
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-white/80 hover:text-primary transition-colors duration-300 font-roboto">
                  Contato
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-primary transition-colors duration-300 font-roboto">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-primary transition-colors duration-300 font-roboto">
                  Termos de Serviço
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-6">
            <h4 className="text-xl font-oswald font-bold gold-accent uppercase tracking-wide">
              Contato
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-white/80 font-roboto">
                  Rua das Modas, 123 - Centro<br />
                  São Paulo - SP, 01234-567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-white/80 font-roboto">
                  (11) 98765-4321
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-white/80 font-roboto">
                  contato@michelmultimarcas.com.br
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 font-roboto text-sm">
              © {currentYear} Michel Multimarcas. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-white/60 hover:text-primary transition-colors duration-300 font-roboto text-sm">
                Política de Privacidade
              </a>
              <a href="#" className="text-white/60 hover:text-primary transition-colors duration-300 font-roboto text-sm">
                Termos de Serviço
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}