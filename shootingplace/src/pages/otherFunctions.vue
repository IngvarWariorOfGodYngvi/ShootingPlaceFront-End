<template>
  <q-page padding>
      <div>
        <q-item>
          <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">Pozostałe Funkcje</div>
        </q-item>
      </div>
      <q-expansion-item label="Lista osób spoza klubu" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
      <q-card class="row text-body2">
        <q-card-section class="col">
      <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold" tabindex="0">Lista osób spoza klubu</div>
          <q-scroll-area class="full-width q-pa-none" style="height: 400px;">
            <ol>
        <li v-for="(others,id) in others" :key="id">
          <div class="row">
           <q-field class="col" label="Nazwisko" standout="bg-accent text-black" stack-label>
                    <div>
                        <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{others.secondName}} {{others.firstName}}</div>
                        <div class="self-center col full-width no-outline text-left text-black" tabindex="0"></div>
                    </div>
           </q-field>
           <q-field class="col" label="Klub" standout="bg-accent text-black" stack-label>
                    <div>
                      <div class="self-center col full-width no-outline text-left text-black" tabindex="0">{{others.club.name}}</div>
                    </div>
           </q-field>
           <q-field class="col" label="telefon" standout="bg-accent text-black" stack-label>
                    <div>
                  <div class="self-center col full-width no-outline text-left text-black row" tabindex="0">{{others.phoneNumber}}</div>
                  </div>
           </q-field>
           <q-field class="col" label="email" standout="bg-accent text-black" stack-label>
                    <div>
                  <div class="self-center col full-width no-outline text-left text-black row" tabindex="1">{{others.email}}</div>
                  </div>
           </q-field>
           <q-btn class="col-1" @click="othersID = others.id,alert=true">usuń</q-btn>
           <q-btn class="col-1" @click="othersID = others.id,otherPersonFirstName = others.firstName,otherPersonSecondName = others.secondName,otherPersonPhoneNumber = others.phoneNumber,otherPersonEmail = others.email,clubNamePerson = others.club.name,getAllClubsToTournament(),editOtherPerson=true">Edytuj</q-btn>
           </div>
           <p></p>
        </li>
        </ol>
           </q-scroll-area>
    </q-card-section>
        </q-card>
      </q-expansion-item>
      <p></p>
      <q-expansion-item label="Lista znanych klubów" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
        <q-card class="text-body2">
          <q-card-section>
          <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold" tabindex="0">Lista znanych klubów</div>
          <div class="q-pb-md"><q-btn @click="createClub=true">utwórz nowy klub</q-btn></div>
            <q-scroll-area class="full-width q-pa-none" style="height: 400px;">
            <div v-for="(club,id) in clubs" :key="id">
              <div v-if="club.name!='BRAK'" class="row">
                <div @dblclick="clubInfoModel=club,clubInfo=true" class="col-2">
                  <q-field label="Klub" standout="bg-accent text-black" stack-label clickable>
                      <div class="self-center col full-width no-outline text-left text-black" tabindex="1">{{club.name}}</div>
                  </q-field>
                </div>
                <div class="col">
                  <a :href="club.url" target="_blank">
                    <q-field class="col" label="strona" standout="bg-accent text-black" stack-label>
                        <div class="self-center col full-width no-outline text-left text-black" tabindex="1">{{club.url}}</div>
                    </q-field>
                  </a>
                </div>
                <div class="col-4">
                  <q-field label="adres" standout="bg-accent text-black" stack-label>
                    <div class="self-center col full-width no-outline text-left text-black" tabindex="1">{{club.address}}</div>
                  </q-field>
                </div>
                  <q-btn class="col-2" @click="clubID = club.id,editClub=true">edytuj dane {{club.name}}</q-btn>
           </div>
            <p></p>
            </div>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <p></p>
      <q-expansion-item label="Lista Konkurencji" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
        <q-card class="text-body2">
          <q-card-section>
          <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold" tabindex="0">Lista Konkurencji</div>
            <q-scroll-area class="full-width q-pa-none" style="height: 400px;">
            <div v-for="(comp,uuid) in competitions" :key="uuid">
              <div v-if="comp.name!='BRAK'" class="col">
                <div class="row">
                  <q-field class="col" label="Konkurencja" standout="bg-accent text-black" stack-label clickable>
                      <div class="self-center col full-width no-outline text-left text-black" tabindex="1">{{comp.name}}</div>
                  </q-field>
                  <q-field class="col-2" label="Kolejność na listach" standout="bg-accent text-black" stack-label clickable>
                      <div class="self-center col full-width no-outline text-center text-black" tabindex="1">{{comp.ordering}}</div>
                  </q-field>
                  <q-btn class="col-4" @click="competition=comp,competitionInfo=true">edytuj dane {{comp.name}}</q-btn>
                </div>
           </div>
            <p></p>
            </div>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <p></p>
      <q-expansion-item label="Dodatkowe Funkcje" dense class="text-left text-h6 text-bold bg-grey-3" group="list">
        <q-card class="text-body2">
            <q-card-section>
          <div class="q-pa-md text-center col full-width no-outline text-h5 text-bold">Dodatkowe Funkcje</div>
          <div class="row">
            <q-select class="full-width" filled v-model="choose" :options="chooseSelect" @input="policeList=[],toEraseList=[]" label="Wybierz Opcję">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                      Brak wyników
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
              <div v-if="choose == chooseSelect[0]" class="q-pa-md">
              <q-radio v-model="tableCondition" :val="true">
                dorośli
              </q-radio>
              <q-radio v-model="tableCondition" :val="false">
                mołodzież
              </q-radio>
                <q-item>
                  <q-btn v-if="tableCondition" color="primary" label="pobierz listę wszystkich klubowiczów dorosłych" @click="showloading (),getAllMembersList()"/>
                  <q-btn v-if="!tableCondition" color="primary" label="pobierz listę wszystkich klubowiczów młodzieżowych" @click="showloading (),getAllMembersList()"/>
                </q-item>
                <q-item>
                  <q-btn color="primary" label="wyświetl listę numerów telefonów" @click="showloading (),getMembersPhoneNumbers (),membersPhoneNumbers = true"/>
                  <q-btn color="primary" label="wyświetl listę email" @click="showloading (),getMembersEmails (),membersEmails = true"/>
                </q-item>
              </div>
              <p></p>
              </div>
              <p></p>
              <div v-if="choose == chooseSelect[1]" class="row">
                <div class="row full-width">
                  <div class="q-pa-md col-6"><q-btn class="full-width" color="primary" label="wyświetl listę osób" @click="showloading (),getMembersToReportToThePolice()"/></div>
                  <div class="q-pa-md col"><q-btn class="full-width" color="primary" label="pobierz listę .pdf" @click="showloading (),generateListOfMembersToReportToPolice()"/></div>
                </div>
                <div class="row full-width">
                  <div v-if="policeList.length>0" class="col-8">
                  <div class="row full-width">
                    <div class="col-1">Lp</div>
                    <div class="col-6">Nazwisko i Imię</div>
                    <div class="col text-center">Numer legitymacji</div>
                    <div class="col text-center">Numer licencji</div>
                    <div class="col text-center">Licencja ważna do</div>
                  </div>
                  <q-virtual-scroll :items="policeList" visible class="full-width q-pa-none">
                    <template v-slot="{ item, index }">
                      <div :key="index" dense class="row">
                        <div class="col-1">{{index+1}}</div>
                        <div class="col-6">{{item.secondName}} {{item.firstName}}</div>
                        <div class="col text-center">{{item.legitimationNumber}}</div>
                        <div class="col text-center">{{item.license.number}}</div>
                        <div class="col text-center">{{item.license.validThru}}</div>
                      </div>
                    </template>
                  </q-virtual-scroll>
                  </div>
                  <div v-if="policeList.length>0" class="col-4">
                    <div class="row full-width">
                      <div class="col-1"></div>
                      <div class="col">Numer Telefonu</div>
                      <div class="col">Email</div>
                    </div>
                    <q-virtual-scroll :items="policeList" visible class="full-width q-pa-none">
                      <template v-slot="{ item, index }">
                        <div :key="index" dense class="row">
                          <div class="col-1"></div>
                          <div class="col-4">{{item.phoneNumber}}</div>
                          <div class="col">{{item.email}}</div>
                        </div>
                      </template>
                    </q-virtual-scroll>
                  </div>
                </div>
              </div>
              <p></p>
              <div v-if="choose == chooseSelect[2]" class="row">
                <div class="row full-width">
                  <div class="q-pa-md col-6"><q-btn class="full-width" color="primary" label="wyświetl listę osób" @click="showloading (),getMembersToErase()"/></div>
                  <div class="q-pa-md col"><q-btn class="full-width" color="primary" label="pobierz listę .pdf" @click="showloading (),getAllMembersToErase()"/></div>
                </div>
                <div class="row full-width">
                  <div v-if="toEraseList.length>0" class="col-8">
                  <div class="row full-width">
                    <div class="col-1">Lp</div>
                    <div class="col-6">Nazwisko i Imię</div>
                    <div class="col text-center">Numer legitymacji</div>
                    <div class="col text-center">Numer licencji</div>
                    <div class="col text-center">Licencja ważna do</div>
                  </div>
                  <q-virtual-scroll :items="toEraseList" visible class="full-width q-pa-none">
                    <template v-slot="{ item, index }">
                      <div :key="index" dense class="row">
                        <div class="col-1">{{index+1}}</div>
                        <div class="col-6">{{item.secondName}} {{item.firstName}}</div>
                        <div class="col text-center">{{item.legitimationNumber}}</div>
                        <div class="col text-center">{{item.license.number}}</div>
                        <div class="col text-center">{{item.license.validThru}}</div>
                      </div>
                    </template>
                  </q-virtual-scroll>
                  </div>
                  <div v-if="toEraseList.length>0" class="col-4">
                    <div class="row full-width">
                      <div class="col-1"></div>
                      <div class="col">Numer Telefonu</div>
                      <div class="col">Email</div>
                    </div>
                    <q-virtual-scroll :items="toEraseList" visible class="full-width q-pa-none">
                      <template v-slot="{ item, index }">
                        <div :key="index" dense class="row">
                          <div class="col-1"></div>
                          <div class="col-4">{{item.phoneNumber}}</div>
                          <div class="col">{{item.email}}</div>
                        </div>
                      </template>
                    </q-virtual-scroll>
                  </div>
                </div>
              </div>
              <div v-if="choose == chooseSelect[3]" class="row">
                <div class="row full-width">
                  <div class="q-pa-md col-6"><q-btn class="full-width" color="primary" label="wyświetl listę osób" @click="showloading (),getMembersErased()"/></div>
                  <div class="q-pa-md col"><q-btn class="full-width" color="primary" label="pobierz listę .pdf" @click="showloading (),getErasedMembers ()"/></div>
                </div>
                <div class="row full-width">
                  <div v-if="erasedList.length>0" class="col-8">
                  <div class="row full-width">
                    <div class="col-1">Lp</div>
                    <div class="col-6">Nazwisko i Imię</div>
                    <div class="col text-center">Numer legitymacji</div>
                    <div class="col text-center">Data Usunięcia</div>
                    <div class="col text-center">Przyczyna</div>
                  </div>
                  <q-virtual-scroll :items="erasedList" visible class="full-width q-pa-none">
                    <template v-slot="{ item, index }">
                      <div :key="index" dense class="row">
                        <div class="col-1">{{index+1}}</div>
                        <div class="col-6">{{item.secondName}} {{item.firstName}}</div>
                        <div class="col text-center">{{item.legitimationNumber}}</div>
                        <div class="col text-center">{{item.erasedEntity.date}}</div>
                        <div class="col text-center">{{item.erasedEntity.erasedType}}</div>
                      </div>
                    </template>
                  </q-virtual-scroll>
                  </div>
                  <div v-if="erasedList.length>0" class="col-4">
                    <div class="row full-width">
                      <div class="col-1"></div>
                      <div class="col">Dodatkowy Opis</div>
                    </div>
                    <q-virtual-scroll :items="erasedList" visible class="full-width q-pa-none">
                      <template v-slot="{ item, index }">
                        <div :key="index" dense class="row">
                          <div class="col-1"></div>
                          <div class="col">{{item.erasedEntity.additionalDescription}}</div>
                        </div>
                      </template>
                    </q-virtual-scroll>
                  </div>
                </div>
              </div>
              <div v-if="choose == chooseSelect[4]" class="row">
                <div class="row full-width">
                 <div class="row">
                   <div class="q-pa-md col full-width"><q-btn class="full-width full-height" color="primary" label="wyświetl listę numerów telefonów klubowiczów bez patentu" @click="showloading (),getMembersPhoneNumbersWithNoPatent (),membersPhoneNumbers = true"/></div>
                   <div class="q-pa-md col full-width"><q-btn class="full-width full-height" color="primary" label="wyświetl listę email klubowiczów bez patentu" @click="showloading (),getMembersEmailsWithNoPatent (),membersEmails = true"/></div>
                 </div>
                </div>
              </div>
              <div v-if="choose == chooseSelect[5]" class="row">
                <div class="row full-width">
                  <div class="row">
                    <div class="q-pa-md col full-width"><q-btn class="full-width full-height" color="primary" label="wyświetl listę numerów telefonów nieaktywnych klubowiczów" @click="showloading (),getMembersPhoneNumbersNoActive (),membersPhoneNumbers = true"/></div>
                    <div class="q-pa-md col full-width"><q-btn class="full-width full-height" color="primary" label="wyświetl listę email nieaktywnych klubowiczów" @click="showloading (),getMembersEmailsNoActive (),membersEmails = true"/></div>
                  </div>
                </div>
              </div>
              <div v-if="choose == chooseSelect[6]" class="row">
                <div class="row full-width">
                  <div class="row">
                    <div class="q-pa-md col full-width"><q-btn color="primary" label="lista klubowiczów z aktualną licencją i bez składek" @click="showloading (),getAllMembersWithLicenseValidAndContributionNotValid()"/></div>
                  </div>
                </div>
              </div>
              <div v-if="choose == chooseSelect[7]" class="q-pa-md">
                <q-btn color="primary" label="pobierz listę obecności klubowiczów" @click="showloading (),getAllMembersListToElection()"/>
              </div>
              <div v-if="choose == chooseSelect[8]" class="q-pa-md">
                <q-btn color="primary" label="pobierz Raport Sędziowania" @click="showloading (),getJudgingReport()"/>
              </div>
              <div v-if="choose == chooseSelect[9]" class="q-pa-none row">
              <div>
                <q-select class="col-3 q-pa-none" filled v-model="monthSelect" clearable use-input  multiple :options="month" dense label="Wybierz Miesiące" fill-input @input="logger(monthSelect)">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Brak wyników
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <p></p>
                <q-item v-if="monthSelect===null" class="col-4 q-pa-none"><q-btn class="q-pa-none" disable color="primary" label="Raport Czasu Pracy - miesięczny"/></q-item>
                <q-item v-else class="col-4 q-pa-none"><q-btn class="q-pa-none" color="primary" label="Raport Czasu Pracy - miesięczny" @click="showloading(),getWorkTimeReport (monthSelect)"/></q-item>
              </div>
              </div>
              <!-- <div class="q-pa-md"><q-btn color="primary" label="mejla ślij" @click="sendMail ()"/></div> -->
            </q-card-section>
          </q-card>
      </q-expansion-item>
    <q-dialog v-model="failure">
      <q-card>
        <q-card-section>
          <div class="text-h6">Coś poszło nie tak</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Czy na pewno usunąć? Zmiana będzie trwała.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="Usuń" color="primary" v-close-popup @click="deactivateOther()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editOtherPerson">
      <q-card>
        <q-card-section>
                <q-item><q-input v-model="otherPersonFirstName" class="full-width" filled label="Imię"></q-input></q-item>
                <q-item><q-input v-model="otherPersonSecondName" class="full-width" filled label="Nazwisko"></q-input></q-item>
                <q-item><q-checkbox left-label color="primary" false-value="" true-value="BRAK" v-model="clubNamePerson" :val="'BRAK'" label="Brak Klubu"></q-checkbox>
                <q-item v-if="clubNamePerson!='BRAK'" class="full-width">
                  <q-select v-if="clubNamePerson!='BRAK'" class="full-width" @new-value="createValue" hide-selected use-chips filled v-model="clubNamePerson" use-input fill-input input-debounce="0" :options="filterOptions" @filter="filterFna" label="Wybierz Klub">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                            Brak wyników
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </q-item>
                </q-item>
                <q-item><q-input v-model="otherPersonPhoneNumber" type="tel" class="full-width" mask="### ### ###" filled label="Telefon"></q-input></q-item>
                <q-item><q-input v-model="otherPersonEmail" type="email" class="full-width" filled label="email"></q-input></q-item>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup/>
          <q-btn flat label="edytuj" color="primary" v-close-popup @click="updateOtherPerson(othersID,otherPersonFirstName, otherPersonSecondName, otherPersonPhoneNumber,otherPersonEmail)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog :position="'top'" v-model="success">
      <q-card>
        <q-card-section>
          <div v-if="message!=null" class="text-h6">{{message}}</div>
        </q-card-section>

      </q-card>
    </q-dialog>

    <q-dialog v-model="membersEmails">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">Lista email wybranych klubowiczów</div>
        <div v-for="email in emails" :key="email">{{email}}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="membersPhoneNumbers">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">Lista numerów telefonów wybranych klubowiczów</div>
        <div v-for="phone in phoneNumbers" :key="phone">{{phone}}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="clubInfo">
      <q-card>
        <q-card-section class="text-bold">
          <div class="text-h6">Informacje dodatkowe o klubie {{clubInfoModel.name}}</div>
        <div>ID : {{clubInfoModel.id}}</div>
        <div v-if="clubInfoModel.id == 1">Pełna nazwa : {{clubInfoModel.fullName}}</div>
        <div v-if="clubInfoModel.id == 1">Numer Licencji Klubowej : {{clubInfoModel.licenseNumber}}</div>
        <div>email : {{clubInfoModel.email}}</div>
        <div>telefon : {{clubInfoModel.phoneNumber}}</div>
        <div>adres : {{clubInfoModel.address}}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="competitionInfo">
      <q-card>
        <q-card-section class="text-bold">
          <div class="text-h6">{{competition.name}}</div>
        <div>ID: {{competition.uuid}}</div>
        <div>Dyscyplina: {{competition.discipline}}</div>
        <div>Ilość Strzałów: {{competition.numberOfShots}}</div>
        <div>Rodzaj: {{competition.type}}</div>
        <div class="row">Metoda Liczenia: <div v-if="competition.countingMethod == 'NORMAL'">: Normalnie</div><div v-else>{{competition.countingMethod}}</div></div>
        <div>Numer Kolejności na Listach: {{competition.ordering}}</div>
        <div>Ilość Strzałów próbnych: {{competition.practiceShots}}</div>
        <div>Kaliber: {{competition.caliberUUID}}</div>
        <q-field class="col-2 cursor-pointer" standout="bg-accent text-black" label="ZMIEŃ NUMER KOLEJNOŚCI NA LISTACH">
            <q-popup-edit @keypress.enter="compID=competition.uuid,updateCompetition()">
                <q-input v-model="orderNumber" input-class="text-center" dense autofocus stack-label label="zmień na inny numer" onkeypress="return (event.charCode > 47 && event.charCode < 58)" @keypress.enter="compID=competition.uuid,updateCompetition()"/>
                <div class="q-pa-xs">
                  <q-btn align="left" color="primary" label="Anuluj" v-close-popup></q-btn>
                  <q-btn align="right" color="primary" label="Zmień" v-close-popup @click="compID=competition.uuid,updateCompetition()"></q-btn>
                </div>
            </q-popup-edit>
        </q-field>
        <q-field class="col-2 cursor-pointer" standout="bg-accent text-black" label="ZMIEŃ ILOŚĆ STRZAŁÓW PRÓBNYCH">
            <q-popup-edit @keypress.enter="compID=competition.uuid,updateCompetition()">
                <q-input v-model="practiceShots" input-class="text-center" dense autofocus stack-label label="zmień na inny numer" onkeypress="return (event.charCode > 47 && event.charCode < 58)" @keypress.enter="compID=competition.uuid,updateCompetition()"/>
                <div class="q-pa-xs">
                  <q-btn align="left" color="primary" label="Anuluj" v-close-popup></q-btn>
                  <q-btn align="right" color="primary" label="Zmień" v-close-popup @click="compID=competition.uuid,updateCompetition()"></q-btn>
                </div>
            </q-popup-edit>
        </q-field>
        <q-field class="col-2 cursor-pointer" standout="bg-accent text-black" label="ZMIEŃ KALIBER">
            <q-popup-edit @keypress.enter="compID=competition.uuid,updateCompetition()">
                <q-input v-model="caliberUUID" input-class="text-center" dense autofocus stack-label label="zmień na inny numer" onkeypress="return (event.charCode > 47 && event.charCode < 58)" @keypress.enter="compID=competition.uuid,updateCompetition()"/>
                <div class="q-pa-xs">
                  <q-btn align="left" color="primary" label="Anuluj" v-close-popup></q-btn>
                  <q-btn align="right" color="primary" label="Zmień" v-close-popup @click="compID=competition.uuid,updateCompetition()"></q-btn>
                </div>
            </q-popup-edit>
        </q-field>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="zamknij" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="createClub">
      <q-card>
        <q-card-section>
          <div class="text-h6" style="min-width: 500px">Utwórz nowy Klub</div>
        </q-card-section>
        <q-card-section>
                <q-item><q-input v-model="clubName" class="full-width" filled label="Nazwa"></q-input></q-item>
                <q-item><q-input v-model="clubFullName" class="full-width" filled label="Pełna nazwa do dokumentów"></q-input></q-item>
                <q-item v-if="clubID == 1"><q-input v-model="clubLicenseNumber" class="full-width" filled label="Numer licencji Klubowej"></q-input></q-item>
                <q-item><q-input v-model="clubPhoneNumber" type="tel" class="full-width" mask="### ### ###" filled label="Telefon"></q-input></q-item>
                <q-item><q-input v-model="clubEmail" type="email" class="full-width" filled label="email"></q-input></q-item>
                <q-item><q-input v-model="clubAddress" type="address" class="full-width" filled label="Adres"></q-input></q-item>
                <q-item><q-input v-model="clubURL" type="url" class="full-width" filled label="Strona internetowa"></q-input></q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="ok" color="primary" v-close-popup @click="createNewClub()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editClub">
      <q-card>
        <q-card-section>
          <div class="text-h6" style="min-width: 500px">Zmień dane klubu</div>
        </q-card-section>
        <q-card-section>
                <q-item><q-input v-model="clubName" class="full-width" filled label="Nazwa"></q-input></q-item>
                <q-item><q-input v-model="clubFullName" class="full-width" filled label="Pełna nazwa do dokumentów"></q-input></q-item>
                <q-item v-if="clubID == 1"><q-input v-model="clubLicenseNumber" class="full-width" filled label="Numer licencji Klubowej"></q-input></q-item>
                <q-item><q-input v-model="clubPhoneNumber" type="tel" class="full-width" mask="### ### ###" filled label="Telefon"></q-input></q-item>
                <q-item><q-input v-model="clubEmail" type="email" class="full-width" filled label="email"></q-input></q-item>
                <q-item><q-input v-model="clubAddress" type="address" class="full-width" filled label="Adres"></q-input></q-item>
                <q-item><q-input v-model="clubURL" type="url" class="full-width" filled label="Strona internetowa"></q-input></q-item>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="anuluj" color="primary" v-close-popup/>
          <q-btn flat label="ok" color="primary" v-close-popup @click="updateClub()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
<q-dialog :position="'top'" v-model="listDownload">
  <q-card>
    <q-card-section class="col">
    <div class="self-center col full-width no-outline text-center text-h5 text-bold">Pobrano Listę</div>
  </q-card-section>
  </q-card>
</q-dialog>
  </q-page>
</template>

<script>
const stringOptions = []
import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
import Vue from 'vue'
import axios from 'axios'
import App from 'src/App.vue'
Vue.prototype.$axios = axios

export default {
  data () {
    return {
      toEraseList: [],
      erasedList: [],
      others: [],
      clubs: [],
      choose: null,
      chooseSelect: ['Listy Klubowiczów', 'Lista do zgłoszenia na Policję', 'Lista do skreślenia', 'Lista skreślonych', 'Osoby bez Patentu', 'Osoby nieaktywne', 'Lista Osób z Licencją i bez składek', 'Lista Obecności', 'Raport Sędziowania', 'Raport Czasu Pracy'],
      month: ['Styczeń', 'Luty', 'Marczec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
      monthSelect: null,
      othersID: null,
      otherPerson: [],
      club: '',
      clubNames: [],
      competitions: null,
      competition: [],
      copmID: null,
      competitionInfo: false,
      listDownload: false,
      orderNumber: null,
      clubNamePerson: null,
      clubID: null,
      clubName: null,
      clubFullName: null,
      clubLicenseNumber: null,
      clubPhoneNumber: null,
      clubEmail: null,
      clubAddress: null,
      clubURL: null,
      clubInfo: false,
      clubInfoModel: [],
      createClub: false,
      policeList: [],
      success: false,
      editClub: false,
      failure: false,
      alert: false,
      editOtherPerson: false,
      otherPersonFirstName: null,
      otherPersonSecondName: null,
      otherPersonPhoneNumber: null,
      otherPersonEmail: null,
      condition: true,
      tableCondition: true,
      practiceShots: null,
      caliberUUID: null,
      emails: null,
      phoneNumbers: null,
      membersEmails: false,
      membersPhoneNumbers: false,
      memberName: null,
      memberUUID: null,
      message: null,
      nowDate: Date.now(),
      filterOptions: stringOptions,
      local: App.host
    }
  },
  created () {
    this.getOther()
    this.getAllClubs()
    this.getCompetitions()
  },
  methods: {
    showloading () {
      this.$q.loading.show({ message: 'Dzieje się coś ważnego... Poczekaj' })
      this.timer = setTimeout(() => {
        this.$q.loading.hide()
        this.timer = 0
      }, 1000)
    },
    logger (item) {
      console.log(item)
    },
    handleScroll (search) {
      const ele = document.getElementById(search)
      const target = getScrollTarget(ele)
      const offset = ele.offsetTop - ele.scrollHeight
      const duration = 500
      setScrollPosition(target, offset, duration)
    },
    getOther () {
      fetch('http://' + this.local + '/other/all', {
        method: 'GET'
      }).then(response => response.json())
        .then(others => {
          this.others = others
        })
    },
    getAllClubs () {
      fetch('http://' + this.local + '/club/', {
        method: 'GET'
      }).then(response => response.json())
        .then(clubs => {
          this.clubs = clubs
        })
    },
    getMembersToReportToThePolice () {
      fetch('http://' + this.local + '/member/getMembersToReportToThePolice', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.policeList = response
        })
    },
    getMembersToErase () {
      fetch('http://' + this.local + '/member/getMembersToErase', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.toEraseList = response
        })
    },
    getMembersErased () {
      fetch('http://' + this.local + '/member/erased', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.erasedList = response
        })
    },
    getMembersEmails () {
      fetch('http://' + this.local + '/member/membersEmails?condition=' + this.tableCondition, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.emails = response
        })
    },
    getMembersPhoneNumbers () {
      fetch('http://' + this.local + '/member/phoneNumbers?condition=' + this.tableCondition, {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.phoneNumbers = response
        })
    },
    getMembersEmailsWithNoPatent () {
      fetch('http://' + this.local + '/member/membersEmailsNoPatent', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.emails = response
        })
    },
    getMembersPhoneNumbersWithNoPatent () {
      fetch('http://' + this.local + '/member/phoneNumbersNoPatent', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.phoneNumbers = response
        })
    },
    getMembersEmailsNoActive () {
      fetch('http://' + this.local + '/member/membersEmailsNoActive', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.emails = response
        })
    },
    getMembersPhoneNumbersNoActive () {
      fetch('http://' + this.local + '/member/phoneNumbersNoActive', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.phoneNumbers = response
        })
    },
    getMembersToEraseEmails () {
      fetch('http://' + this.local + '/member/membersToEraseEmails', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.emails = response
        })
    },
    getMembersToErasePhoneNumbers () {
      fetch('http://' + this.local + '/member/membersToErasePhoneNumbers', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.phoneNumbers = response
        })
    },
    getMembersToPoliceEmails () {
      fetch('http://' + this.local + '/member/membersToPoliceEmails', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.emails = response
        })
    },
    getMembersToPolicePhoneNumbers () {
      fetch('http://' + this.local + '/member/membersToPolicePhoneNumbers', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.phoneNumbers = response
        })
    },
    getCompetitions () {
      fetch('http://' + this.local + '/competition/', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.competitions = response
        })
    },
    updateClub () {
      const data = {
        name: this.clubName,
        fullName: this.clubFullName,
        licenseNumber: this.clubLicenseNumber,
        phoneNumber: this.clubPhoneNumber,
        email: this.clubEmail,
        address: this.clubAddress,
        url: this.clubURL
      }
      fetch('http://' + this.local + '/club/' + this.clubID, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.message = response
          this.success = true
          this.clubName = null
          this.clubFullName = null
          this.clubLicenseNumber = null
          this.clubEmail = null
          this.clubAddress = null
          this.clubURL = null
          this.getOther()
          this.getAllClubs()
          this.autoClose()
        } else {
          this.failure = true
          this.autoClose()
        }
      })
    },
    createNewClub () {
      const data = {
        name: this.clubName,
        fullName: this.clubFullName,
        licenseNumber: this.clubLicenseNumber,
        phoneNumber: this.clubPhoneNumber,
        email: this.clubEmail,
        address: this.clubAddress,
        url: this.clubURL
      }
      fetch('http://' + this.local + '/club/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              this.success = true
              this.message = response
              this.clubName = null
              this.clubFullName = null
              this.clubLicenseNumber = null
              this.clubEmail = null
              this.clubAddress = null
              this.clubURL = null
              this.getOther()
              this.getAllClubs()
              this.autoClose()
            }
          )
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    updateCompetition () {
      const data = {
        ordering: this.orderNumber,
        practiceShots: this.practiceShots,
        caliberUUID: this.caliberUUID
      }
      fetch('http://' + this.local + '/competition/update?uuid=' + this.compID, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          response.json().then(
            response => {
              if (this.orderNumber !== null) {
                this.competition.ordering = this.orderNumber
              }
              if (this.practiceShots !== null) {
                this.competition.practiceShots = this.practiceShots
              }
              if (this.caliberUUID !== null) {
                this.competition.caliberUUID = this.caliberUUID
              }
              this.message = response
              this.success = true
              this.showloading()
              this.getCompetitions()
              this.autoClose()
            })
        } else {
          response.json().then(
            response => {
              this.message = response
              this.failure = true
              this.autoClose()
            }
          )
        }
      })
    },
    updateOtherPerson (id, first, second, phone, mail) {
      const data = {
        firstName: first,
        secondName: second,
        phoneNumber: phone,
        email: mail
      }
      fetch('http://' + this.local + '/other/?id=' + id + '&clubName=' + this.clubNamePerson, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.status === 200) {
          this.getOther()
          this.success = true
          this.autoClose()
        } else {
          this.failure = true
          this.autoClose()
        }
      })
    },
    deactivateOther () {
      fetch('http://' + this.local + '/other/?id=' + this.othersID, {
        method: 'POST'
      }).then(response => {
        if (response.status === 200) {
          this.success = true
          this.othersID = null
          this.getOther()
          this.getAllClubs()
          this.autoClose()
        } else {
          this.failure = true
          this.autoClose()
        }
      })
    },
    getAllMembersList () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllMembers/?condition=' + this.tableCondition,
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_na_dzień ' + this.nowDate + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getAllMembersListToElection () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllMembersToElection',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_obecności_klubowiczów.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getJudgingReport () {
      axios({
        url: 'http://' + this.local + '/files/downloadJudgingReport',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Raport sędziowania.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    generateListOfMembersToReportToPolice () {
      axios({
        url: 'http://' + this.local + '/files/generateListOfMembersToReportToPolice',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_do_zgłoszenia_na_policję.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getAllMembersWithLicenseValidAndContributionNotValid () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllMembersWithValidLicenseNoContribution/',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_z_licencją_bez_składek_' + this.nowDate + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getAllMembersToErase () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllMembersToErased/',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_do_skreślenia_' + this.nowDate + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getErasedMembers () {
      axios({
        url: 'http://' + this.local + '/files/downloadAllErasedMembers',
        method: 'GET',
        responseType: 'blob'
      }).then(response => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Lista_klubowiczów_skreślonych_' + this.nowDate + '.pdf')
        document.body.appendChild(fileLink)
        fileLink.click()
        this.listDownload = true
        this.autoClose()
      })
    },
    getWorkTimeReport (month) {
      if (month !== null) {
        axios({
          url: 'http://' + this.local + '/files/downloadWorkReport?month=' + month,
          method: 'GET',
          responseType: 'blob'
        }).then(response => {
          const fileURL = window.URL.createObjectURL(new Blob([response.data]))
          const fileLink = document.createElement('a')
          fileLink.href = fileURL
          fileLink.setAttribute('download', 'raport_pracy_' + month + '.pdf')
          document.body.appendChild(fileLink)
          fileLink.click()
          this.listDownload = true
          this.autoClose()
        })
      }
    },
    createValue (val, done) {
      if (val.length > 0) {
        const model = (this.clubNames || []).slice()

        val
          .split(/[,;|]+/)
          .map(v => v.trim())
          .filter(v => v.length > 0)
          .forEach(v => {
            if (this.clubNames.includes(v) === false) {
              this.clubNames.push(v)
            }
            if (model.includes(v) === false) {
              model.push(v)
            }
          })

        done(null)
        this.clubNames = model
      }
    },
    filterFna (val, update) {
      update(() => {
        if (val === '') {
          this.filterOptions = this.clubNames
        } else {
          const needle = val.toLowerCase()
          this.filterOptions = this.clubNames.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    },
    getAllClubsToTournament () {
      fetch('http://' + this.local + '/club/tournament', {
        method: 'GET'
      }).then(response => response.json())
        .then(response => {
          this.clubNames = response
        })
    },
    autoClose () {
      setTimeout(() => {
        this.success = false
        this.failure = false
        this.listDownload = false
      }, 2000)
    }
  },
  name: 'otherFunction'
}
</script>
