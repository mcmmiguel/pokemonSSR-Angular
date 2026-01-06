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
import { SimplePokemon } from '../../pokemons/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pokemons-page',
  imports: [PokemonsList, PokemonListSkeleton],
  templateUrl: './pokemons-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPage implements OnInit {
  private appRef = inject(ApplicationRef);
  private pokemonsService = inject(PokemonsService);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private title = inject(Title);

  currentPage = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => params.get('page') ?? '1'),
      map((page) => (isNaN(+page) ? 1 : +page)),
      map((page) => Math.max(1, page))
    )
  );

  pokemons = signal<SimplePokemon[]>([]);

  // isLoading = signal(true);

  private $appState = this.appRef.isStable.subscribe((isStable) => {
    console.log({ isStable });
  });

  public loadPokemons(nextPage = 0) {
    const pageToLoad = this.currentPage()! + nextPage;
    this.pokemonsService
      .loadPage(pageToLoad)
      .pipe(
        tap(() =>
          this.router.navigate([], {
            queryParams: {
              page: pageToLoad,
            },
          })
        ),
        tap(() => this.title.setTitle(`Pokemons SSR - Page ${pageToLoad}`))
      )
      .subscribe((pokemons) => {
        console.log('ON INIT');
        this.pokemons.set(pokemons);
      });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(console.log);
    this.loadPokemons();
  }

  // ngOnDestroy(): void {
  //   console.log('Destroy');
  //   this.$appState.unsubscribe();
  // }
}
