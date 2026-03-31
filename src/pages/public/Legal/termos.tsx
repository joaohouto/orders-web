import { SiteFooter } from "@/components/footer";
import { Header } from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { info } from "@/config/app";

export function TermosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-12 md:py-16">
        <div className="space-y-2 mb-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Legal
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Termos de Uso</h1>
          <p className="text-sm text-muted-foreground">
            Última atualização: 31 de março de 2026
          </p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-semibold">1. Natureza da plataforma</h2>
            <p className="text-muted-foreground">
              O <strong className="text-foreground">{info.appName}</strong> é uma
              plataforma de marketplace que conecta compradores a vendedores
              independentes em ambientes universitários. O {info.appName}{" "}
              <strong className="text-foreground">não é vendedor</strong> de
              nenhum produto ou serviço anunciado: atua exclusivamente como
              intermediário tecnológico, disponibilizando a infraestrutura para
              que os vendedores cadastrados exponham e comercializem seus
              produtos diretamente com os compradores.
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-base font-semibold">
              2. Responsabilidade dos vendedores
            </h2>
            <p className="text-muted-foreground">
              Cada vendedor cadastrado na plataforma é o único e exclusivo
              responsável por:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>
                A veracidade, qualidade, segurança e legalidade dos produtos
                e serviços ofertados;
              </li>
              <li>
                O cumprimento das obrigações decorrentes do contrato de compra
                e venda celebrado com o comprador, incluindo entrega, prazo e
                conformidade com o anunciado;
              </li>
              <li>
                O recolhimento de quaisquer tributos incidentes sobre as
                transações realizadas;
              </li>
              <li>
                O atendimento ao comprador em caso de reclamações, trocas,
                devoluções ou qualquer inconformidade no pedido.
              </li>
            </ul>
            <p className="text-muted-foreground">
              A relação jurídica de consumo é estabelecida diretamente entre
              comprador e vendedor. O {info.appName} não é parte nessa relação
              e não assume responsabilidade solidária ou subsidiária pelas
              obrigações do vendedor perante o comprador.
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-base font-semibold">
              3. Pagamento via PIX
            </h2>
            <p className="text-muted-foreground">
              O {info.appName} disponibiliza, de forma técnica, o link de
              pagamento via PIX para facilitar a conclusão da compra. O{" "}
              <strong className="text-foreground">
                recebimento dos valores é de inteira responsabilidade do
                vendedor
              </strong>
              . O {info.appName} não intermedia, retém, processa nem responde
              por quaisquer valores transacionados entre comprador e vendedor.
              Eventuais divergências, estornos ou disputas financeiras devem
              ser resolvidas diretamente entre as partes.
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-base font-semibold">
              4. Limitação de responsabilidade da plataforma
            </h2>
            <p className="text-muted-foreground">
              O {info.appName} não se responsabiliza por:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>
                Produtos não entregues, entregues com atraso, danificados ou
                em desconformidade com o anunciado;
              </li>
              <li>
                Condutas fraudulentas ou ilícitas praticadas por vendedores;
              </li>
              <li>
                Prejuízos decorrentes de transações realizadas fora da
                plataforma;
              </li>
              <li>
                Interrupções, falhas técnicas ou indisponibilidade temporária
                dos serviços.
              </li>
            </ul>
            <p className="text-muted-foreground">
              O comprador que se sentir prejudicado deve primeiramente tentar
              resolver a questão diretamente com o vendedor. O {info.appName}{" "}
              pode, a seu critério e sem obrigação legal, atuar como facilitador
              na comunicação entre as partes.
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-base font-semibold">
              5. Cadastro e uso da plataforma
            </h2>
            <p className="text-muted-foreground">
              O uso da plataforma requer cadastro com informações verdadeiras e
              atualizadas. O usuário é responsável pela confidencialidade de
              suas credenciais. É vedado o uso da plataforma para fins ilícitos,
              a criação de contas falsas ou a oferta de produtos proibidos por
              lei.
            </p>
            <p className="text-muted-foreground">
              O {info.appName} reserva-se o direito de suspender ou encerrar
              contas que violem estes termos, sem aviso prévio e sem
              responsabilidade por quaisquer perdas decorrentes dessa medida.
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-base font-semibold">
              6. Propriedade intelectual
            </h2>
            <p className="text-muted-foreground">
              Todo o conteúdo da plataforma — incluindo marca, logotipo, layout,
              código-fonte e textos institucionais — é de propriedade exclusiva
              do {info.appName} e protegido pela legislação de propriedade
              intelectual. É vedada a reprodução, distribuição ou uso não
              autorizado.
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-base font-semibold">
              7. Alterações nos termos
            </h2>
            <p className="text-muted-foreground">
              Estes termos podem ser atualizados a qualquer momento. O uso
              continuado da plataforma após a publicação de alterações implica
              aceitação dos novos termos.
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-base font-semibold">8. Lei aplicável e foro</h2>
            <p className="text-muted-foreground">
              Estes termos são regidos pela legislação brasileira. Fica eleito
              o foro da comarca do domicílio do usuário para dirimir quaisquer
              conflitos, nos termos do art. 101, inciso I, do Código de Defesa
              do Consumidor.
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-base font-semibold">9. Contato</h2>
            <p className="text-muted-foreground">
              Dúvidas sobre estes termos:{" "}
              <a
                href={`mailto:${info.supportMail}`}
                className="text-foreground underline underline-offset-4"
              >
                {info.supportMail}
              </a>
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
