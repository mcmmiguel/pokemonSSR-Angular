import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PokemonsList } from '../../pokemons/components/pokemons-list/pokemons-list';

@Component({
  selector: 'app-pokemons-page',
  imports: [PokemonsList],
  templateUrl: './pokemons-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPage {}
