<template>
  <div>
    <q-btn glossy color="secondary" class="col" label="przeczytaj RODO" @click="shootingplaceRODO = true"></q-btn>
    <q-dialog v-model="shootingplaceRODO">
      <q-page-container class="bg-dark text-positive" style="min-width: 75vw">
        <q-card-section class="text-center">
          <h4>ZGODA NA PRZETWARZANIE DANYCH OSOBOWYCH<br />INFORMACJA O POLITYCE PRYWATNOŚCI</h4>
          <p class="text-left">
          1. ADMINISTRATOR DANYCH OSOBOWYCH
          Administratorem Pana/Pani danych osobowych są:<br/>
              a/ Klub Strzelecki RCS Panaszew, Panaszew 4a, 99-200 Poddębice, NIP 8281419260 REGON 389252480<br/>
              b/ Regionalne Centrum Strzeleckie Panaszew Sp. z o.o., Panaszew 4a, 99-200 Poddębice, KRS 0000892545 NIP
          8281419076 REGON 388545546</p>
          <p class="text-left">2.W SPRAWACH DOTYCZĄCYCH PRZETWARZANIA DANYCH OSOBOWYCH<br/> MOŻESZ SKONTAKTOWAĆ SIĘ Z ADMINISTRATOREM POD adresem
          e-mail: biuro@rcspanaszew.pl , tel. 578 321 111</p>
          <p class="text-left">3. ZAKRES PRZETWARZANYCH DANYCH OSOBOWYCH UŻYTKOWNIKÓW DOTYCZY m.in.:<br/>
          a/ Imienia i nazwiska,<br/>
          b/ Adresu e-mail<br/>
          c/ Numer telefonu,<br/>
          d/ Adres do doręczeń: jeśli wymagane dla wysyłki bonów podarunkowych, licencji.<br/>
          e/ Prowadzenia działań edukacyjnych i promocyjnych,<br/>
          f/ Zawarcia i realizacji umów,<br/>
          g/Wystawienia faktur, prowadzenia i przechowywanie dokumentacji rachunkowej,<br/>
          h/Monitoringu,<br/>
          i/ Celów archiwalnych/ dowodowych na wypadek prawnej potrzeby wykazania faktów oraz w celu ewentualnego
          ustalenia, dochodzenia lub obrony przed roszczeniami, co jest naszym prawnie uzasadnionym interesem,<br/>
          j/ Celów analitycznych, takich jak dobór usług do naszych klientów, optymalizacja naszych produktów lub usług
          na
          podstawie uwag klientów, optymalizacja procesów obsługi na podstawie przebiegu obsługi sprzedaży i
          posprzedażowej, co jest naszym prawnie uzasadnionym interesem,<br/>
          k/ Badania satysfakcji klientów i określania jakości naszej obsługi, co jest naszym prawnie uzasadnionym
          interesem.</p>
          <p class="text-left">4. CELE I PODSTAWA PRAWNA PRZETWARZANIA DANYCH<br/>
          Dane osobowe są przetwarzane zgodnie z obowiązującym prawem, w tym z Rozporządzeniem Parlamentu
          Europejskiego
          i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO). Przetwarzamy dane w następujących celach:<br/>
          a/ Realizacja usług: przetwarzanie danych w celu umówienia i potwierdzenia rezerwacji toru strzeleckiego,
          zakupu
          bonów podarunkowych oraz świadczenia innych usług dostępnych w ofercie klubu i spółki. (art. 6 ust. 1 lit. b
          RODO – wykonanie umowy)<br/>
          b/ Obsługa płatności: realizacja transakcji za pośrednictwem operatorów płatności Przelewy 24, Elavon, PolCard
          (art. 6 ust. 1 lit. b RODO – wykonanie umowy)<br/>
          c/ Kontakt z klientem: odpowiadanie na pytania, potwierdzanie rezerwacji, informowanie o zawodach, zmianach w
          usługach, . (art. 6 ust. 1 lit. b RODO – wykonanie umowy)<br/>
          d/ Realizacja obowiązków prawnych: wystawianie faktur, przechowywanie danych na potrzeby księgowe oraz
          spełnianie
          innych wymogów prawnych. (art. 6 ust. 1 lit. c RODO – obowiązek prawny)<br/>
          e/ Bezpieczeństwo i ochrona prawna: zabezpieczenie przed ewentualnymi roszczeniami lub konieczność obrony przed
          nimi. (art. 6 ust. 1 lit. f RODO – uzasadniony interes administratora).</p>
          <p class="text-left">5. PRZEKAZYWANIE DANYCH OSOBOWYCH<br/>
          a/ Nie udostępniamy danych osobowych osobom trzecim, chyba że jest to konieczne do realizacji naszych usług.
          Odbiorcami danych mogą być:<br/>
          - Operator płatności Przelewy24, Elavon, PolCard – w celu obsługi płatności online,<br/>
          - Dostawcy usług kurierskich i pocztowych – w przypadku wysyłki licencji, bonów podarunkowych w formie
          fizycznej,<br/>
          - Podmioty upoważnione na podstawie przepisów prawa, takie jak PZSS, organy administracji publicznej, jeśli
          wymagają tego obowiązujące regulacje,<br/>
          - Dostawca usług księgowych, który przetwarza Pana / Pani dane widoczne na fakturach,<br/>
          - Dostawca usługi Saldeo: jest to związane z elektronicznym obiegu dokumentów księgowych w klubie,<br/>
          - Dostawcy usług informatycznych w celu stosowania odpowiednich środków technicznych i organizacyjnych
          zapewniających bezpieczeństwo danych.<br/>
          b/ Ponieważ korzystamy z usług Google LLC (w celu przechowywania Pana / Pani danych osobowych na serwerze
          skrzynki pocztowej oraz w kalendarzu rezerwacji on-line) Pana/Pani dane mogą być przekazywane do Stanów
          Zjednoczonych Ameryki (USA). Google przystąpił do programu Privacy Shield i w ten sposób gwarantuje odpowiedni
          poziom ochrony danych osobowych wymagany przez przepisy europejskie.</p>
          <p class="text-left">6. OKRES PRZECHOWYWANIA DANYCH
          Pana / Pani dane będą przetwarzane do końca okresu przedawnienia potencjalnych roszczeń z umowy. Dane zawarte
          na
          fakturach będą przetwarzane do końca okresu, przez który przepisy prawa wymagają przechowywać dokumentację
          rachunkową. Ponadto, część danych może być również przetwarzana po upływie wskazanych wcześniej okresów przez
          czas prowadzenia przez nas działalności w celach archiwalnych, analitycznych i statystycznych opisanych
          bardziej
          szczegółowo powyżej w ramach wskazania na cele i podstawy przetwarzania danych.</p>
          <p class="text-left">7. PRAWA OSÓB, KTÓRYCH DANE DOTYCZĄ<br/>
          a/ Każda osoba, której dane przetwarzamy, ma następujące prawa:<br/>
          - Prawo dostępu do swoich danych (art. 15 RODO),<br/>
          - Prawo do sprostowania nieprawidłowych danych (art. 16 RODO),<br/>
          - Prawo do usunięcia danych („prawo do bycia zapomnianym”) – jeśli nie istnieją podstawy do dalszego
          przetwarzania (art. 17 RODO),<br/>
          - Prawo do ograniczenia przetwarzania danych (art. 18 RODO),<br/>
          - Prawo do przenoszenia danych (art. 20 RODO),<br/>
          - Prawo do wniesienia sprzeciwu wobec przetwarzania (art. 21 RODO).<br/>
          b/ Aby skorzystać z powyższych praw, skontaktuj się z nami pod adresem: biuro@rcspanaszew.pl<br/>
          c/ Jeśli uważasz, że Twoje dane są przetwarzane niezgodnie z prawem, możesz złożyć skargę do Prezesa Urzędu
          Ochrony Danych Osobowych (PUODO).</p>
          <p class="text-left">8. ZABEZPIECZENIA DANYCH OSOBOWYCH<br/>
          Stosujemy odpowiednie środki techniczne i organizacyjne zapewniające bezpieczeństwo danych, w tym:<br/>
          a/ szyfrowanie transmisji danych (SSL),<br/>
          b/ zabezpieczenie dostępu do systemów informatycznych,<br/>
          c/ kontrolę dostępu do danych tylko dla upoważnionych osób.</p>
          <p class="text-left">9. PLIKI COOKIES I ŚLEDZENIE AKTYWNOŚCI<br/>
          Nasza strona internetowa www.rcspanaszew.pl może korzystać z plików cookies w celu poprawy jakości usług i
          dostosowania treści do użytkownika. Użytkownik może zmienić ustawienia plików cookies w swojej przeglądarce
          internetowej.</p>
          <p class="text-left">10. ZMIANY W POLITYCE PRYWATNOŚCI<br/>
          Zastrzegamy sobie prawo do wprowadzenia zmian w niniejszej polityce prywatności. O istotnych zmianach będziemy
          informować użytkowników poprzez naszą stronę internetową.</p>
          <p class="text-left">11. INFORMACJA O WYMOGU / DOBROWOLNOŚCI PODANY DANYCH<br/>
          Podanie danych osobowych jest dobrowolne, ale niezbędne do skorzystania z naszych usług, m.in. takich jak
          korzystanie ze strzelnicy, rezerwacja toru strzeleckiego czy zakup bonów podarunkowych.</p>
          <p class="text-left">12. KONSEKWENCJĄ NIEPODANIA DANYCH OSOBOWYCH będzie brak możliwości realizacji zadań statutowych przez RCS
          Panaszew oraz zadań przez RCS Panaszew Sp. z o.o. w sprawach dotyczących z korzystania z obiektu, zawarcia
          umów.</p>
        <q-page-sticky expand position="top">
          <q-card-actions align="right">
          <q-btn glossy color="secondary" v-close-popup label="zamknij"></q-btn>
        </q-card-actions>
          </q-page-sticky>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn glossy color="secondary" v-close-popup label="zamknij"></q-btn>
        </q-card-actions>
      </q-page-container>
    </q-dialog>
  </div>
</template>
<script>

export default {
  data () {
    return {
      shootingplaceRODO: false
    }
  }
}
</script>
