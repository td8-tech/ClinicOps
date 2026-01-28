export default function Footer() {
  return (
    <footer className="py-8 border-t bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>© 2026 ClinicOps. Todos os direitos reservados.</p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="#" className="hover:text-foreground">Termos de Uso</a>
          <a href="#" className="hover:text-foreground">Privacidade</a>
          <a href="#" className="hover:text-foreground">Contato</a>
        </div>
      </div>
    </footer>
  );
}
