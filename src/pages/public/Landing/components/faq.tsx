import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { info } from "@/config/app";
import { Link } from "react-router";

const items = [
  {
    q: `O ${info.appName} vende os produtos?`,
    a: `Não. O ${info.appName} é uma plataforma de marketplace: conectamos compradores às lojas universitárias, mas não somos vendedor de nenhum produto. Cada loja é responsável pelos próprios itens, preços, estoque e entrega.`,
  },
  {
    q: "Como funciona o pagamento?",
    a: `O pagamento é feito diretamente entre você e o vendedor via PIX. O ${info.appName} não intermedia, retém nem processa nenhum valor — por isso não coletamos dados bancários ou de cartão.`,
  },
  {
    q: "Tive um problema com meu pedido. O que faço?",
    a: `Entre em contato diretamente com a loja responsável pelo pedido. A relação de compra e venda é estabelecida entre você e o vendedor. O ${info.appName} pode atuar como facilitador na comunicação, mas não assume responsabilidade pelas obrigações do vendedor.`,
  },
  {
    q: "Quais dados pessoais vocês coletam?",
    a: `Coletamos apenas o necessário para o funcionamento da plataforma: nome, e-mail, telefone e CPF (para identificação e viabilização dos pedidos), além de dados de acesso como IP para segurança e prevenção a fraudes. Não coletamos dados de pagamento.`,
  },
  {
    q: "Meus dados são compartilhados com terceiros?",
    a: `Seus dados (nome, telefone e CPF) são compartilhados apenas com o vendedor do respectivo pedido, para fins de entrega e comunicação. Não vendemos nem alugamos dados para fins comerciais.`,
  },
  {
    q: "Posso solicitar a exclusão dos meus dados?",
    a: (
      <>
        Sim. Nos termos da LGPD (art. 18), você pode solicitar acesso, correção,
        bloqueio ou eliminação dos seus dados a qualquer momento. Basta enviar
        um e-mail para{" "}
        <a
          href={`mailto:${info.supportMail}`}
          className="underline underline-offset-4"
        >
          {info.supportMail}
        </a>{" "}
        e responderemos em até 15 dias úteis.
      </>
    ),
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t bg-background">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 max-w-2xl">
        <p className="text-xs uppercase text-muted-foreground tracking-widest text-center mb-10">
          Perguntas frequentes
        </p>

        <Accordion type="single" collapsible className="w-full">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
