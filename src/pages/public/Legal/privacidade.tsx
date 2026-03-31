import { SiteFooter } from "@/components/footer";
import { Header } from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { info } from "@/config/app";

export function PrivacidadePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-12 md:py-16">
        <div className="space-y-2 mb-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Legal
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Política de Privacidade
          </h1>
          <p className="text-sm text-muted-foreground">
            Última atualização: 31 de março de 2026
          </p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-semibold">1. Controlador dos dados</h2>
            <p className="text-muted-foreground">
              Esta política descreve como o{" "}
              <strong className="text-foreground">{info.appName}</strong> coleta,
              utiliza e protege os dados pessoais dos usuários, em conformidade
              com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 —
              LGPD). O contato do Encarregado de Proteção de Dados (DPO) é:{" "}
              <a
                href={`mailto:${info.supportMail}`}
                className="text-foreground underline underline-offset-4"
              >
                {info.supportMail}
              </a>
              .
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-base font-semibold">
              2. Dados coletados e finalidades
            </h2>
            <p className="text-muted-foreground">
              Coletamos apenas os dados necessários para o funcionamento da
              plataforma:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>
                <strong className="text-foreground">
                  Nome, e-mail, telefone e CPF:
                </strong>{" "}
                para identificação, autenticação e viabilização dos pedidos
                junto aos vendedores;
              </li>
              <li>
                <strong className="text-foreground">Dados de pedidos:</strong>{" "}
                itens, valores e status, para exibição ao comprador e ao
                vendedor responsável;
              </li>
              <li>
                <strong className="text-foreground">
                  Endereço IP e dados de acesso:
                </strong>{" "}
                para segurança, prevenção a fraudes e logs de auditoria.
              </li>
            </ul>
            <p className="text-muted-foreground">
              Não coletamos dados de pagamento. O pagamento é realizado
              diretamente via PIX entre comprador e vendedor; o {info.appName}{" "}
              não acessa, processa nem armazena dados financeiros.
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-base font-semibold">
              3. Compartilhamento de dados
            </h2>
            <p className="text-muted-foreground">
              Os dados do comprador (nome, telefone e CPF) são compartilhados
              com o vendedor do respectivo pedido para fins de entrega e
              comunicação. Não vendemos, alugamos nem compartilhamos dados com
              terceiros para fins comerciais. O compartilhamento ocorre apenas:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Com o vendedor responsável pelo pedido;</li>
              <li>
                Com autoridades públicas, quando exigido por lei ou ordem
                judicial.
              </li>
            </ul>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-base font-semibold">4. Base legal (LGPD)</h2>
            <p className="text-muted-foreground">
              O tratamento dos dados pessoais é realizado com base nas seguintes
              hipóteses previstas no art. 7º da LGPD:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>
                <strong className="text-foreground">Execução de contrato</strong>{" "}
                (art. 7º, V): necessário para viabilizar o pedido entre
                comprador e vendedor;
              </li>
              <li>
                <strong className="text-foreground">
                  Legítimo interesse
                </strong>{" "}
                (art. 7º, IX): para segurança, prevenção a fraudes e melhoria
                dos serviços.
              </li>
            </ul>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-base font-semibold">5. Direitos do titular</h2>
            <p className="text-muted-foreground">
              Nos termos do art. 18 da LGPD, o usuário tem direito a:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Confirmar a existência de tratamento de seus dados;</li>
              <li>Acessar, corrigir ou atualizar seus dados;</li>
              <li>
                Solicitar a anonimização, bloqueio ou eliminação de dados
                desnecessários;
              </li>
              <li>
                Revogar o consentimento, quando aplicável, sem prejuízo da
                licitude do tratamento anterior;
              </li>
              <li>
                Solicitar a portabilidade dos dados a outro fornecedor de
                serviço.
              </li>
            </ul>
            <p className="text-muted-foreground">
              Para exercer esses direitos, entre em contato pelo e-mail{" "}
              <a
                href={`mailto:${info.supportMail}`}
                className="text-foreground underline underline-offset-4"
              >
                {info.supportMail}
              </a>
              . Responderemos em até 15 dias úteis.
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-base font-semibold">6. Retenção e exclusão</h2>
            <p className="text-muted-foreground">
              Os dados são mantidos pelo tempo necessário para o cumprimento das
              finalidades descritas e das obrigações legais. Dados de pedidos
              podem ser retidos por até 5 anos para fins de obrigações fiscais e
              legais. Após esse prazo, são eliminados ou anonimizados.
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-base font-semibold">7. Segurança</h2>
            <p className="text-muted-foreground">
              Adotamos medidas técnicas e organizacionais para proteger os dados
              contra acesso não autorizado, perda ou destruição, incluindo
              criptografia em trânsito (HTTPS/TLS) e controle de acesso
              baseado em funções. Em caso de incidente de segurança que possa
              acarretar risco ao titular, notificaremos a ANPD e os usuários
              afetados nos prazos previstos pela LGPD.
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-base font-semibold">8. Cookies</h2>
            <p className="text-muted-foreground">
              Utilizamos cookies essenciais para autenticação e funcionamento da
              plataforma. Não utilizamos cookies de rastreamento ou publicidade
              comportamental de terceiros. O bloqueio de cookies essenciais pode
              impedir o funcionamento correto da plataforma.
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-base font-semibold">
              9. Alterações nesta política
            </h2>
            <p className="text-muted-foreground">
              Esta política pode ser atualizada periodicamente. Alterações
              relevantes serão comunicadas por e-mail ou aviso na plataforma. O
              uso continuado após a publicação implica aceitação das alterações.
            </p>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-base font-semibold">10. Contato e DPO</h2>
            <p className="text-muted-foreground">
              Para dúvidas, solicitações ou reclamações relacionadas à
              privacidade:{" "}
              <a
                href={`mailto:${info.supportMail}`}
                className="text-foreground underline underline-offset-4"
              >
                {info.supportMail}
              </a>
              . Caso não obtenha resposta satisfatória, o titular pode
              acionar a Autoridade Nacional de Proteção de Dados (ANPD) em{" "}
              <a
                href="https://www.gov.br/anpd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4"
              >
                gov.br/anpd
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
