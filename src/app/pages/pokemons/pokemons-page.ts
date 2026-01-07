import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { PokemonsList } from '../../pokemons/components/pokemons-list/pokemons-list';
import { PokemonListSkeleton } from './ui/pokemon-list-skeleton/pokemon-list-skeleton';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { SimplePokemon } from '../../pokemons/interfaces';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pokemons-page',
  imports: [PokemonsList, PokemonListSkeleton, RouterLink],
  templateUrl: './pokemons-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPage {
  private appRef = inject(ApplicationRef);
  private pokemonsService = inject(PokemonsService);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private title = inject(Title);

  loadOnPageChange = effect(() => {
    this.loadPokemons(this.currentPage());
  });

  currentPage = toSignal(
    this.route.params.pipe(
      map((params) => params['page'] ?? '1'),
      map((page) => (isNaN(+page) ? 1 : +page)),
      map((page) => Math.max(1, page))
    )
  );

  pokemons = signal<SimplePokemon[]>([]);

  private $appState = this.appRef.isStable.subscribe((isStable) => {
    console.log({ isStable });
  });

  public loadPokemons(nextPage = 0) {
    this.pokemonsService
      .loadPage(nextPage)
      .pipe(tap(() => this.title.setTitle(`Pokemons SSR - Page ${nextPage}`)))
      .subscribe((pokemons) => {
        console.log('ON INIT');
        this.pokemons.set(pokemons);
      });
  }
}
