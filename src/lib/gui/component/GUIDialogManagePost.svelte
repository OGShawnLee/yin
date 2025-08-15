<script lang="ts">
	import type { PostShape } from '@business/schema/PostSchema';
	import GUIDialog from '@gui/component/GUIDialog.svelte';
	import { CurrentUserState } from '@gui/State';
	import { Dialog } from 'bits-ui';
	import { GearSix, Package, PencilLine, PushPin, Eraser, Sparkle } from 'phosphor-svelte';

	const currentUser = CurrentUserState.getContext();

	export let post: PostShape;

	$: isOwner = $currentUser?.displayName === post.user.displayName;

	function getEditLeftTime(createdAt: Date | null | undefined) {
		if (createdAt) {
			const inThreeDays = new Date(createdAt);
			inThreeDays.setHours(inThreeDays.getHours() + 72);
			const now = new Date();

			if (now < inThreeDays) {
				const diffInMs = inThreeDays.getTime() - now.getTime();
				const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
				return diffInHours;
			}

			return 0;
		}

		return 0;
	}
</script>

{#if isOwner}
	<Dialog.Root>
		<Dialog.Trigger class="flex items-center gap-2 hover:cursor-pointer text-side">
			<GearSix size={16} />
			<span class="text-xs"> Manage Post </span>
		</Dialog.Trigger>
		<GUIDialog title="Manage Post">
			<button class="flex gap-2 opacity-30" disabled>
				<div class="size-10 min-w-10 flex items-center justify-center">
					<Package class="text-main" size={36} />
				</div>
				<span class="flex flex-col gap-2 text-left">
					<span class="font-bold text-white"> Archive </span>
					<span class="font-medium text-xs text-side">
						Your post will only be visible to you. It can be restored.
					</span>
				</span>
			</button>
			{#if post.hasEditAvailable}
				<a class="flex gap-2" href="/post/{post.id}/compose?state=EDIT_POST">
					<div class="size-10 min-w-10 flex items-center justify-center">
						<PencilLine class={post.user.isPro ? 'text-pro' : 'text-main'} size={36} />
					</div>
					<span class="flex flex-col gap-2 text-left">
						<span class="font-bold text-white"> Edit </span>
						<span class="font-medium text-xs text-side">
							{#if post.user.isPro}
								You can edit this post up to <span class="text-pro font-black">5</span> times ({5 -
									post.editCount} left), within 3 days of creation ({getEditLeftTime(
									post.createdAt
								)} hours left).
							{:else}
								You can edit this post up to 3 times, within 3 days of creation ({getEditLeftTime(
									post.createdAt
								)} hours left).
							{/if}
						</span>
					</span>
				</a>
			{/if}
			<button class="flex gap-2 opacity-30" disabled>
				<div class="size-10 min-w-10 flex items-center justify-center">
					<Sparkle class="text-main" size={36} />
				</div>
				<span class="flex flex-col gap-2 text-left">
					<span class="font-bold text-white"> Highlight </span>
					<span class="font-medium text-xs text-side">
						Your post will appear in your Highlights section in your profile page. Show what you are
						proud of.
					</span>
				</span>
			</button>
			<button class="flex gap-2 opacity-30" disabled>
				<div class="size-10 min-w-10 flex items-center justify-center">
					<PushPin class="text-main" size={36} />
				</div>
				<span class="flex flex-col gap-2 text-left">
					<span class="font-bold text-white"> Pin </span>
					<span class="font-medium text-xs text-side">
						Your post will appear always at the top of your Posts section in your profile page.
					</span>
				</span>
			</button>
			<button class="flex gap-2 opacity-30" disabled>
				<div class="size-10 min-w-10 flex items-center justify-center">
					<Eraser class="text-danger" size={36} />
				</div>
				<span class="flex flex-col gap-2 text-left">
					<span class="font-bold text-white"> Delete </span>
					<span class="font-medium text-xs text-side">
						Your post will be deleted permanently. It can't be restored.
					</span>
				</span>
			</button>
			<button class="button--side w-full" slot="footer"> Close </button>
		</GUIDialog>
	</Dialog.Root>
{/if}
