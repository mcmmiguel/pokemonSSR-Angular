import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PokemonCard } from '../pokemon-card/pokemon-card';

@Component({
  selector: 'app-pokemons-list',
  imports: [PokemonCard],
  templateUrl: './pokemons-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonsList {}
