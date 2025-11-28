import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { PokemonsList } from '../../pokemons/components/pokemons-list/pokemons-list';
import { PokemonListSkeleton } from './ui/pokemon-list-skeleton/pokemon-list-skeleton';
import { PokemonsService } from '../../pokemons/services/pokemons.service';

@Component({
  selector: 'app-pokemons-page',
  imports: [PokemonsList, PokemonListSkeleton],
  templateUrl: './pokemons-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPage implements OnInit {
  isLoading = signal(true);
  private appRef = inject(ApplicationRef);

  private pokemonsService = inject(PokemonsService);

  private $appState = this.appRef.isStable.subscribe((isStable) => {
    console.log({ isStable });
  });

  public loadPokemons(nextPage = 0) {
    this.pokemonsService.loadPage(nextPage).subscribe((pokemons) => {
      console.log('ON INIT');
    });
  }

  ngOnInit() {
    this.loadPokemons();
  }

  // ngOnDestroy(): void {
  //   console.log('Destroy');
  //   this.$appState.unsubscribe();
  // }
}
