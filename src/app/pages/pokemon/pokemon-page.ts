import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Pokemon } from '../../pokemons/interfaces';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pokemon-page',
  imports: [],
  templateUrl: './pokemon-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonPage implements OnInit {
  pokemonsService = inject(PokemonsService);
  private route = inject(ActivatedRoute);
  private title = inject(Title);
  private meta = inject(Meta);

  pokemon = signal<Pokemon | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    if (!id) return;

    this.pokemonsService
      .loadPokemon(id)
      .pipe(
        tap(({ id, name }) => {
          const pageTitle = `#${id} - ${name}`;
          const pageDescription = `#${id} - ${name}`;

          this.title.setTitle(pageTitle);

          this.meta.updateTag({
            name: 'description',
            content: 'Información sobre el pokémon ' + name,
          });
          this.meta.updateTag({
            name: 'og:title',
            content: 'Información sobre el pokémon ' + name,
          });
          this.meta.updateTag({
            name: 'og:description',
            content: pageDescription,
          });
          this.meta.updateTag({
            name: 'og:image',
            content: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
          });
        })
      )
      .subscribe(this.pokemon.set);
  }
}
