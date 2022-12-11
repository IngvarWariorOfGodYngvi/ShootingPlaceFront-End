<template>
  <q-page padding>
  <div>
        <q-item>
          <div class="text-center col full-width no-outline text-h4 text-bold" tabindex="0">Lista Klubowiczów</div>
        </q-item>
      </div>
      <q-card class="row" style="height:20vh;">
        <div class="col-4">
          <q-item>
            <q-select dense class="full-width rounded text-white" :label="memberName" label-color="white" input-style="color: white;" bg-color="primary" use-input filled hide-selected :options="options" @filter="filter" @input="allMember = false" :value="options">
                  <template v-slot:option="option">
                    <q-item class="rounded" dense style="padding: 0; margin: 0;" v-bind="option['itemProps']" v-on="option.itemEvents" >
                      <q-item-section v-if="option['opt'].active" style="padding: 0.5em; margin: 0;" @click="memberName = option.opt.secondName+' '+option.opt.firstName+' '+ option.opt.legitimationNumber;temp = option.opt.legitimationNumber;temp = option.opt.legitimationNumber">
                        <div v-if="option.opt.adult">{{option.opt.secondName}} {{option.opt.firstName}} {{option.opt.legitimationNumber}} Ogólna</div>
                        <div v-else>{{option.opt.secondName}} {{option.opt.firstName}} {{option.opt.legitimationNumber}} Młodzież</div>
                      </q-item-section>
                      <q-item-section v-else style="padding: 0.5em; margin: 0;" class="bg-red-2 rounded" @click="memberName = option.opt.secondName+' '+option.opt.firstName+' '+ option.opt.legitimationNumber;temp = option.opt.legitimationNumber">
                        <div v-if="option.opt.adult">{{option.opt.secondName}} {{option.opt.firstName}} {{option.opt.legitimationNumber}} Ogólna - BRAK SKŁADEK</div>
                        <div v-else>{{option.opt.secondName}} {{option.opt.firstName}} {{option.opt.legitimationNumber}} Młodzież - BRAK SKŁADEK</div>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Brak wyników - sprawdź w nieaktywnych
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
          </q-item>
          <q-item>
            <div class="col-9 bg-grey-1"><q-input type="password" v-model="barcode" dense class="full-width" filled label="numer karty" @keypress.enter="findMemberByBarCode();allMember = false;memberName=null"></q-input></div>
            <div class="col-3 text-grey"><q-btn class="text-black full-width full-height" label="wyszukaj" @click="findMemberByBarCode();allMember = false;memberName=null"/></div>
          </q-item>
        </div>
        <div class=" col-8">
          <q-card class="bg-grey-3 q-pa-xs col">
            <div class="row">
            <q-checkbox dense @input="memberName=null; temp=null;adult=null;active=null;erase=false;getMembersNames ();getAllMemberDTO()" v-model="allMember" label="Wyświetl wszystkich"></q-checkbox>
            <div class="col full-width">
              <div class="row flex flex-left full-width">
                <q-radio @input="member=null;allMember=false;getMembersNames ();rearrangeMemberDTO ()" color="green" v-model="adult" :val="true" label="Grupa Ogólna"></q-radio>
                <q-radio @input="member=null;allMember=false;getMembersNames ();rearrangeMemberDTO ()" color="warning" v-model="adult" :val="false" label="Grupa Młodzieżowa"></q-radio>
              </div>
              <div class="row flex flex-left full-width">
                <q-radio @input="member=null;allMember=false;erase=false; getMembersNames ();rearrangeMemberDTO ()" color="green" v-model="active" :val="true" label="Aktywni"></q-radio>
                <q-radio @input="member=null;allMember=false;getMembersNames ();rearrangeMemberDTO ()" color="warning" v-model="active" :val="false" label="Nieaktywni"></q-radio>
              </div>
            </div>
            </div>
            <div class="row">
            <q-checkbox dense @input="memberName=null; temp=null;allMember=!erase;active = false; getMembersNames ();getAllMemberDTOWithArgs();erasedType = erasedTypes[0]" color="red" v-model="erase" :val="false" label="Skreśleni"></q-checkbox>
            </div>
          </q-card>
          <q-card>
          <div class="row text-bold text-center text-caption">
            <q-item dense class="bg-accent">Ilość klubowiczów</q-item>
            <q-item dense v-if="allMember||allMember==null">Ogółem : {{quantities[0] + quantities[3]}} ({{quantities[0]}} + {{quantities[3]}})</q-item>
            <q-item dense v-if="allMember||allMember==null">Aktywni : {{quantities[10]+quantities[4]}} ({{quantities[10]}} + {{quantities[4]}})</q-item>
            <q-item dense v-if="allMember||allMember==null">Nieaktywni : {{quantities[11]+quantities[5]}} ({{quantities[11]}} + {{quantities[5]}})</q-item>
            <q-item dense v-if="(adult!=null&&adult)&&!erase">Gr. Ogólna ogółem : {{quantities[0]}}</q-item>
            <q-item dense v-if="(adult!=null&&adult)&&!erase">Aktywni : {{quantities[10]}}</q-item>
            <q-item dense v-if="(adult!=null&&adult)&&!erase">Nieaktywni : {{quantities[11]}}</q-item>
            <q-item dense v-if="(adult!=null&&!adult)&&!erase">Gr. Młodzieżowa ogółem : {{quantities[3]}}</q-item>
            <q-item dense v-if="(adult!=null&&!adult)&&!erase">Aktywni : {{quantities[4]}}</q-item>
            <q-item dense v-if="(adult!=null&&!adult)&&!erase">Nieaktywni : {{quantities[5]}}</q-item>
            <q-item dense v-if="erase">Skreśleni ogółem : {{quantities[6] + quantities[7]}}</q-item>
            <q-item dense v-if="adult&&erase">Skreśleni Gr. Ogólna : {{quantities[6]}}</q-item>
            <q-item dense v-if="!adult&&erase">Skreśleni Gr. Młodzieżowa : {{quantities[7]}}</q-item>
        </div>
          </q-card>
        </div>
      </q-card>
      <q-item></q-item>
    <Member v-if="temp!=null" :member-number-legitimation="temp"></Member>
      <div v-if="temp==null" class="full-width">
        <div v-if="memberDTOArg.length<1" class="text-center text-bold text-h5">
          Brak Wyników
        </div>
            <q-virtual-scroll :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :virtual-scroll-sticky-size-end="32" dense :items="memberDTOArgRearrangeTable"  type="table" visible class="row full-width q-pa-none" style="height: 90vh;">
          <template v-slot:before>
        <thead class="thead-sticky text-left">
          <tr>
            <th class="text-left" @click="sort='name';sortF (sort)">{{memberDTOArgRearrangeTable.length}} <q-icon size="2em" :name="sortName?'arrow_drop_up':'arrow_drop_down'"/>Imię i nazwisko</th>
            <th class="text-left" @click="sort='date';sortF (sort)"><q-icon size="2em" :name="sortDate?'arrow_drop_up':'arrow_drop_down'"/>Data zapisu</th>
            <th v-if="!erase" class="text-left">Wpis do portalu PZSS</th>
            <th v-if="!erase" class="text-center">Zdjęcie</th>
            <th class="text-left" @click="sort='numberLeg';sortF (sort)" ><q-icon size="2em" :name="sortLegitimation?'arrow_drop_up':'arrow_drop_down'"/>Numer Legitymacji</th>
            <th class="text-center" @click="sort='numberLicense';sortF (sort)"><q-icon size="2em" :name="sortLicense?'arrow_drop_up':'arrow_drop_down'"/>Licencja</th>
            <th v-if="!erase" class="text-center">Status</th>
            <th v-else class="text-center">podstawa skreślenia</th>
          </tr>
        </thead>
          </template>
    <template v-slot="{ item, index }">
      <tr v-if="!item.erased" :key="index" class="rounded" style="cursor:pointer" @click="showloading();allMember=false;memberName =item.secondName + ' '+item.firstName+' leg. '+item.legitimationNumber;temp = item.legitimationNumber">
        <td style="width:25%;" :class="item.club.id===1?'xyz':'xyz bg-secondary text-white'"><b>{{index +1 + ' '}}</b>{{item.club.id===1?item.secondName + ' ' + item.firstName:item.secondName + ' ' + item.firstName + ' ' + item.club.name}}</td>
        <td style="width:10%;" class="text-center">{{convertDate(item.joinDate)}}</td>
        <td style="width:5%;" :class="item.pzss?'bg-green-3 text-center':'bg-warning text-center text-black'"><q-icon :name="item.pzss?'done':'cancel'" :color="item.pzss?'':'primary'" size="1rem"/></td>
        <td style="width:5%;" :class="item.image!=null?'bg-green-3 text-center':'text-center'"><q-icon :name="item.image!=null?'done':'cancel'" :color="item.image!=null?'':'primary'" size="1rem"/></td>
        <td style="width:10%;" class="text-center text-bold">{{item.legitimationNumber}}</td>
        <td style="width:15%;" v-if="item.license.number!=null && item.license.valid" class="bg-green-3 text-center"><q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Aktualna</q-tooltip><div>{{item.license.number}}</div></td>
        <td style="width:15%;" v-if="item.license.number!=null && !item.license.valid" class="bg-warning text-center"><q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Nieaktualna - ważna do: {{convertDate(item.license.validThru)}}</q-tooltip><div>{{item.license.number}}</div></td>
        <td style="width:15%;" v-if="item.license.number==null" class="text-center"><q-icon name="density_large"/><q-icon name="density_large"/><q-icon name="density_large"/><q-icon name="density_large"/><q-icon name="density_large"/></td>
        <td :class="item.active?'bg-green-3 text-center':'bg-red-3 text-center'">{{item.active?'Klubowicz Aktywny':'Klubowicz Nieaktywny'}}</td>
      </tr>
      <tr v-if="item.erased" :key="index" style="cursor:pointer" class="full-width rounded" @click="showloading();allMember=false;memberName =item.secondName + ' '+item.firstName+' leg. '+item.legitimationNumber;temp = item.legitimationNumber">
        <td style="width:25%;" class="xyz"><b>{{index +1}}</b> {{item.secondName}} {{item.firstName}}</td>
        <td style="width:10%;" class="text-center">{{convertDate(item.joinDate)}}</td>
        <td style="width:10%;" class="text-center text-bold">{{item.legitimationNumber}}</td>
        <td v-if="item.license.number!=null && item.license.valid" class="bg-green-3 text-center"><q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Aktualna</q-tooltip><div>{{item.license.number}}</div></td>
        <td v-if="item.license.number!=null && !item.license.valid" class="bg-warning text-center"><q-tooltip anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">Nieaktualna - ważna do: {{convertDate(item.license.validThru)}}</q-tooltip><div>{{item.license.number}}</div></td>
        <td v-if="item.license.number==null" class="text-center"><q-icon name="density_large"/><q-icon name="density_large"/><q-icon name="density_large"/><q-icon name="density_large"/><q-icon name="density_large"/></td>
        <td class="bg-grey-3"><div class="self-center full-width no-outline text-center text-black" tabindex="0">{{item.erasedEntity.erasedType}} {{convertDate(item.erasedEntity.date)}}</div>
                  <q-tooltip v-if="item.erasedEntity.additionalDescription!=null" anchor="top middle" :offset="[35, 35]" content-class="text-body1 bg-secondary">{{item.erasedEntity.additionalDescription}}</q-tooltip></td>
      </tr>
    </template>
        </q-virtual-scroll>
      </div>
  </q-page>
</template>
<style src="../style/style.scss" lang="scss">

</style>

<script src="../scripts/membersList.js">
</script>
