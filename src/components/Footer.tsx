
const Footer = () => {
  return (
    <footer className="w-full border-t border-border/40 bg-card/30 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="gradient-border w-fit mx-auto">
            <div className="bg-background px-4 py-2 rounded-lg">
              <span className="gradient-text text-lg font-semibold">TicketSwap</span>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-muted-foreground text-sm leading-relaxed">
              <strong className="text-card-foreground">Important:</strong> This site does not process payments or guarantee ticket delivery. 
              All transactions are between buyers and sellers directly. Use at your own discretion and always verify tickets before payment.
            </p>
          </div>
          
          <div className="text-xs text-muted-foreground pt-4 border-t border-border/40">
            © 2024 TicketSwap. Connecting music fans safely across the USA.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
